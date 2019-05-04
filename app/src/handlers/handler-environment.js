module.exports = function(ctx, resolve) {
    return {
        getEnvironment: function() {
            const environmentId = ctx.request.params.environment_id;

            return ctx.models.environment.findOne({where: {id: environmentId}})
                .then(environmentObj => {
                    if(!environmentObj)
                        throw new Error('Environment not found');
                    return environmentObj.dataValues;
                })
                .then(environment => {
                    return ctx.models.domain_subdomain.findAll({
                        where: {
                            environment_id: environmentId
                        },
                        include: [{model: ctx.models.domain_base  , as: 'domain'  }]
                    },{raw: true}).then(subdomains => {
                        return {
                            ...environment,
                            domains: subdomains.map(subdomain => `${subdomain.subdomain}.${subdomain.domain.base}`)
                        };
                    });
                })
                .then(environment => {
                    return ctx.models.environment_configuration
                        .findOne({where: {environment_id: environmentId, active: true}})
                        .then(configuration => {
                            return {
                                ...environment,
                                services: configuration && configuration.config_json && configuration.config_json.services,
                                configuration: configuration && configuration.config_json
                            };
                        });
                })
                .then(environment => {
                    resolve(environment);
                })
                .catch(err => resolve({message: err && err.message || err}, err && err.status || 400))
        },
        getEnvironments: function() {
            return ctx.models.environment.findAll()
                .then(environments => resolve({environments}));
        },
        getEnvironmentsByProject: function() {
            return ctx.models.environment.findAll({where: {project_id: ctx.request.params.project_id}})
                .then(environments => resolve({environments}));
        },
        createEnvironment: function() {
            return ctx.models.environment.create(ctx.request.body)
                .then(environment => resolve(environment))
                .catch(err => resolve({error: err}, 400));
        },
        updateEnvironment: async function() {
            let environment = await ctx.models.environment.findOne({where: {id: ctx.request.params.id}});

            if(!environment) {
                return resolve(404);
            }

            for(let key in ctx.request.body) {
                if(['name', 'subdomain'].indexOf(key) !== -1) {
                    environment[key] = ctx.request.body[key];
                }
            }

            return environment.save()
                .then(updatedEntity => resolve(updatedEntity))
                .catch(err => resolve({error: err}, 400));
        },
        addDomain: function() {
            let environmentId = ctx.request.params.environment_id,
                domain = ctx.request.body.domain,
                baseName = domain.replace(/^([a-z1-9\-]+)\.(.+)$/, '$2'),
                subdomainName = domain.replace(/^([a-z1-9\-]+)\.(.+)$/, '$1');

            return Promise.resolve()
                .then(() => {
                    console.log('create subdomain', subdomainName, 'for', environmentId, 'U',baseName);
                    return ctx.models.environment.findOne({where: {id: environmentId}})
                })
                .then(environment => {
                    return ctx.models.domain_base.findOrCreate({
                        where: {
                            project_id: environment.project_id,
                            base: baseName,
                            // verified: true => enable later
                        }
                    })
                }).then(bases => {
                    let base = bases[0].dataValues;
                    return ctx.models.domain_subdomain.create({
                        domain_id: base.id,
                        environment_id: environmentId,
                        subdomain: subdomainName,
                        // verified: true => enable later
                    })
                }).then(subdomain => {
                    resolve(subdomain);
                }).catch(err => resolve({error: err && err.message || err}, 400));


        }

    }
};
