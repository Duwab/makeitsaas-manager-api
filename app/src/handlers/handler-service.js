module.exports = function(ctx, resolve) {
    return {
        getService: function() {
            for(var key in ctx)
                console.log('key', key);
            const serviceId = ctx.request.params.service_id;

            return ctx.models.service.findOne({where: {id: serviceId}})
                .then(service => resolve(service))
                .catch(err => resolve({message: 'service not found'}, 404));
        },
        getServices: function() {
            return ctx.models.service.findAll()
                .then(services => resolve({services}));
        },
        getServicesByProject: function() {
            return ctx.models.service.findAll({where: {project_id: ctx.request.params.project_id}})
                .then(services => resolve({services}));
        },
        createService: function() {
            ctx.models.service.create(ctx.request.body)
                .then(service => resolve(service))
                .catch(err => resolve({error: err}, 400));
        },
        updateService: async function() {
            let service = await ctx.models.service.findOne({where: {id: ctx.request.params.id}});

            if(!service) {
                return resolve(404);
            }

            for(let key in ctx.request.body) {
                if(['name', 'description', 'type', 'repository_url', 'position'].indexOf(key) !== -1) {
                    service[key] = ctx.request.body[key];
                }
            }

            return service.save()
                .then(updatedEntity => resolve(updatedEntity))
                .catch(err => resolve({error: err}, 400));
        }
    }
};
