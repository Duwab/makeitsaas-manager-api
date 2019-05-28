module.exports = function(ctx, resolve) {
  return {
    routingResolve: function() {
      resolve({
        routing: 'calls handlers properly'
      }, 200);
      ctx.queue.publish('logs', 'resolved simpleResolve');
    },
    authenticationResolve: function() {
      resolve({
        authenticated: ctx.user.isAuthenticated(),
        infos: ctx.user.jwt
      })
    },
    modelResolve: function() {
      ctx.models.character.findAll().then(characters => {
        resolve({
          something: 'else',
          characters
        })
      }).catch(error => {
        resolve({error})
      });
      ctx.queue.publish('logs', 'resolved modelResolve');
    }
  }
};
