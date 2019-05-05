const Op = require('sequelize').Op;

module.exports = function(ctx, resolve) {
    return {
        getConfiguration: function() {
            const environmentId = ctx.request.params.environment_id,
                configurationId = ctx.request.params.configuration_id;

            return ctx.models.environment_configuration.findOne({where: {id: configurationId, environment_id: environmentId}})
                .then(config => resolve(config))
                .catch(err => resolve({message: 'config not found'}, 404));
        },
        getConfigurations: function() {
            const environmentId = ctx.request.params.environment_id;
            return ctx.models.environment_configuration.findAll({where: {environment_id: environmentId}})
                .then(configurations => resolve({configurations}));
        },
        /**
         * User sends a whole new configuration
         * We just check that config user has worked with is still the last active configuration (except if he uses --force flag)
         */
        overrideConfiguration: function() {
            const environmentId = ctx.request.params.environment_id,
                lastConfigurationId = ctx.request.body.last_configuration_id && `${ctx.request.body.last_configuration_id}`,
                overrideConfiguration = ctx.request.body.override_configuration,
                forceMode = ctx.request.body.force;

            if(!overrideConfiguration || !overrideConfiguration.services) {
                throw new Error('Invalid request (missing configuration)');
            }
            ctx.models.environment_configuration.findOne({
                where: {
                    id: lastConfigurationId,
                    environment_id: environmentId,
                    active: true
                }
            }).then(currentConfiguration => {
                // check if configuration matches
                if(
                    (!lastConfigurationId && currentConfiguration) ||
                    (lastConfigurationId && (!currentConfiguration || (`${currentConfiguration.id}` !== lastConfigurationId)))
                ) {
                    if(!forceMode) {
                        throw new Error('Configuration has been modified meanwhile')
                    }
                }
            }).then(() => {
                // create config
                return ctx.models.environment_configuration.create({
                    environment_id: environmentId,
                    config_json: overrideConfiguration,
                    active: true
                })
            }).then(newConfig => {
                // deactivate previous configurations
                return ctx.models.environment_configuration.update(
                    {
                        active: false
                    },
                    {
                        where: {
                            id: {[Op.not]: newConfig.id},
                            environment_id: environmentId,
                            active: true
                        }
                    }
                ).then(() => newConfig);
            }).then(newConfig => resolve(newConfig))
                .catch(err => resolve({error: err && err.message || err}, 400));
        },
    }
};
