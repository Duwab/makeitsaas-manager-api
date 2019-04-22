module.exports = function(ctx, resolve) {
    return {
        getDomain: function() {
            for(var key in ctx)
                console.log('key', key);
            const domainId = ctx.request.params.domain_id;

            return ctx.models.domain.findOne({where: {id: domainId}})
                .then(domain => resolve(domain))
                .catch(err => resolve({message: 'domain not found'}, 404));
        },
        getDomains: function() {
            return ctx.models.domain.findAll()
                .then(domains => resolve({domains}));
        },
        getDomainsByProject: function() {
            return ctx.models.domain.findAll({where: {project_id: ctx.request.params.project_id}})
                .then(domains => resolve({domains}));
        },
        createDomain: function() {
            ctx.models.domain.create(ctx.request.body)
                .then(domain => resolve(domain))
                .catch(err => resolve({error: err}, 400));
        },
        updateDomain: async function() {
            let domain = await ctx.models.domain.findOne({where: {id: ctx.request.params.id}});

            if(!domain) {
                return resolve(404);
            }

            domain.name = ctx.request.body.name;

            return domain.save()
                .then(updatedEntity => resolve(updatedEntity))
                .catch(err => resolve({error: err}, 400));
        }
    }
};
