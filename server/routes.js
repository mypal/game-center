/**
 * @type {{}}
 */
module.exports = {
    '/index': async function(ctx) {
        ctx.state = {
            session: this.session,
            title: 'index'
        };
        await ctx.render('index', {
            test: 'abc'
        });
    },
    '/test/:id': {
        method: 'get',
        action: async function(ctx) {
            ctx.body = 'test'+ctx.params.id;
        }
    },
    '*': async function(ctx) {
        ctx.body = 'default page';
    }
};
