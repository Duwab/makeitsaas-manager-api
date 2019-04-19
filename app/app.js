require('@make-it-saas/api').then(framework => {
  let subLogs = framework.queue.observable('logs').subscribe(message => {
    console.log('some log', message);
  });

  framework.queue.observable('entity-change').subscribe(message => {
    console.log('=> entity-change :');
    console.log(message);
  });

}).catch((e) => console.log('error', e));
