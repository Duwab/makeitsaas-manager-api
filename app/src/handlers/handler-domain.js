module.exports = function(ctx, resolve) {
    return {
        getDomainBase: function() {
            for(var key in ctx)
                console.log('key', key);
            const domainId = ctx.request.params.domain_base_id;

            return ctx.models.domain_base.findOne({where: {id: domainId}})
                .then(domain => resolve(domain))
                .catch(err => resolve({message: 'domain not found'}, 404));
        },
        getDomainBases: function() {
            return ctx.models.domain_base.findAll()
                .then(domains => resolve({domains}));
        },
        getDomainBasesByProject: function() {
            return ctx.models.domain_base.findAll({where: {project_id: ctx.request.params.project_id}})
                .then(domains => resolve({domains}));
        },
        createDomainBase: function() {
            ctx.models.domain_base.create(ctx.request.body)
                .then(domain => resolve(domain))
                .catch(err => resolve({error: err}, 400));
        },
        updateDomainBase: async function() {
            let domain = await ctx.models.domain_base.findOne({where: {id: ctx.request.params.id}});

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
