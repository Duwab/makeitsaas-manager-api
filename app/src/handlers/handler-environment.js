module.exports = function(ctx, resolve) {
    return {
        getEnvironment: function() {
            const environmentId = ctx.request.params.environment_id;

            return ctx.models.environment.findOne({where: {id: environmentId}})
                .then(environment => {
                    ctx.models.environment_configuration
                        .findOne({where: {environment_id: environmentId, active: true}})
                        .then(configuration => {
                            resolve({
                                ...environment.dataValues,
                                configuration: configuration && configuration.config_json
                            })
                        });
                })
                .catch(err => resolve({message: 'environment not found'}, 404));
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
            ctx.models.environment.create(ctx.request.body)
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
        }
    }
};
