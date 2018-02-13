module.exports = (app) => {

    return {
        computed: app.utils.sharedComputed(),
        methods: Object.assign({
            activateCall: function(call) {
                // Remove the new call when clicking on it again while
                // it is active.
                if (call.active && call.status === 'new') {
                    app.emit('bg:calls:call_delete', {callId: call.id})
                } else {
                    // Otherwise it's just activated.
                    app.emit('bg:calls:call_activate', {
                        callId: call.id,
                        holdInactive: false,
                        unholdActive: false,
                    })
                }
            },
            classes: function(call, block) {
                let classes = {}
                if (block === 'call-button') {
                    classes.fa = true
                    if (call.status === 'new') {
                        classes.active = call.active
                        classes['new-call'] = true
                        // Show the close icon.
                        if (call.active) {
                            classes['fa-times'] = true
                        } else {
                            // Otherwise it is just a new call button.
                            classes['fa-bookmark-o'] = true
                        }
                    } else {
                        classes['ongoing-call'] = true
                        classes.active = call.active
                        if (call.transfer.type === 'accept') classes.hint = true
                        if (call.hold) {
                            classes['fa-pause'] = true
                        } else classes['icon-phone'] = true
                    }
                }
                return classes
            },
            /**
            * A new call can only be created when there are no other
            * calls with the `new` status.
            * @returns {Boolean} - Whether it should be possible to create a new call.
            */
            newCallAllowed: function() {
                let available = true
                for (let callId of Object.keys(this.calls)) {
                    if (['new', 'create', 'invite'].includes(this.calls[callId].status)) {
                        available = false
                    }
                }
                return available
            },
        }, app.utils.sharedMethods()),
        render: templates.call_switch.r,
        staticRenderFns: templates.call_switch.s,
        store: {
            calls: 'calls.calls',
        },
    }
}
