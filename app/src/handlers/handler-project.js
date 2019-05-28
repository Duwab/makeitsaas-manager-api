module.exports = function(ctx, resolve) {
    return {
        getProject: function() {
            const projectId = ctx.request.params.project_id;

            return ctx.models.project.findByPk(projectId)
                .then(project => resolve(project))
                .catch(err => resolve({message: 'Project not found'}, 404));
        },
        getProjects: function() {
            let userId = ctx.user && ctx.user.jwt && ctx.user.jwt.id || 0;
            return ctx.models.project.findAll({where: {user_id: userId}})
                .then(projects => resolve({projects}));
        },
        createProject: function() {
            ctx.models.project.create(ctx.request.body)
                .then(project => resolve(project))
                .catch(err => resolve({error: err}, 400));
        },
        updateProject: async function() {
            let project = await ctx.models.project.findOne({where: {id: ctx.request.params.id}});

            if(!project) {
                return resolve(404);
            }

            project.name = ctx.request.body.name;

            return project.save()
                .then(updatedEntity => resolve(updatedEntity))
                .catch(err => resolve({error: err}, 400));
        }
    }
};
