module.exports = function(ctx, resolve) {

    // put that in a service
    function generateDeploymentOrderSpecification(environmentId) {
        return getConfig(environmentId)
            .then(config => {
                return Promise.all([
                    convertLinkToDomains(config.domains),
                    convertLinksToServices(config.services)
                ]).then(([domainSpecs, servicesSpecs]) => {
                    return {
                        action: "update",
                        ...config,
                        domains: domainSpecs,
                        services: servicesSpecs
                    }
                })
            });
    }

    function convertLinkToDomains(domainLinks) {
        return Promise.all(domainLinks.map(link => {
            return link && link.domain_id && ctx.models.domain
                .findOne({where: {id: link.domain_id}})
                .then(domain => {
                    return domain && link.subdomain && `${link.subdomain}${domain.base}`;
                })
        })).then(domainSpecs => {
            return domainSpecs.filter(spec => !!spec);
        });
    }

    function convertLinksToServices(serviceLinks) {
        return Promise.all(serviceLinks.map(link => {
            return link && link.service_id && ctx.models.service
                .findOne({where: {id: link.service_id}})
                .then(service => {
                    return service && {
                        id: service.id,
                        repository_url: service.repository_url,
                        path: link.path,
                        version: link.version
                    }
                })
        })).then(serviceSpecs => {
            return serviceSpecs.filter(spec => !!spec);
        });
    }

    function getConfig(environmentId) {
        return ctx.models.environment_configuration.findOne({
            where: {
                environment_id: environmentId,
                active: true
            }
        }).then(activeConfig => {
            let config = activeConfig && activeConfig.config_json || {};
            return {
                // default values
                environment_id: environmentId,
                domains: config.domains || [],
                services: [],

                // stored_values
                ...config
            }
        });
    }

    return {
        getDeploymentOrder: function() {
            const environmentId = ctx.request.params.environment_id;

            generateDeploymentOrderSpecification(environmentId)
                .then(orderSpec => resolve({order: orderSpec}))
                .catch(err => resolve({error: err && err.message || err}, 500));
        },
        getDeploymentChecks: function() {
        },
        deploy: function() {
        },
    }
};
