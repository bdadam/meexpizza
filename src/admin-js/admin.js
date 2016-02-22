const $ = require('jquery/dist/jquery');
const ko = require('knockout');
const Firebase = require('firebase');
const moment = require('moment');

const fb = new Firebase("https://meexpizza.firebaseio.com/orders");
const query = fb.orderByChild('timestamp').limitToLast(50);

moment.locale('hu');

const createOrder = (id, obj) => {
    obj.items = obj.items.map(item => {
        item.extras = item.extras || [];
        item.variant = item.variant || '';
        return item;
    });

    return {
        id: ko.observable(id),
        address: ko.observable(obj.address),
        deliveryFee: ko.observable(obj.deliveryFee),
        totalPrice: ko.observable(obj.totalPrice),
        items: ko.observableArray(obj.items),
        formattedTime: ko.computed(function() {
            return moment(obj.timestamp).format('LLL');
        }),

        deliver: () => {
            // console.log('DELIVER', id);
        }
    };
};

const appViewModel = {
    isAuthPending: ko.observable(false),
    isAuthenticated: ko.observable(false),
    email: ko.observable(''), // meexpizza@gmail.com
    token: ko.observable(''),
    uid: ko.observable(''),
    password: ko.observable(''),
    oldPassword: ko.observable(''),
    newPassword: ko.observable(''),
    authErrorMessage: ko.observable(''),
    orders: ko.observableArray(),
    pastOrders: ko.observableArray(),
    passwordChangeShown: ko.observable(false),

    login: () => {
        const email = appViewModel.email();
        const password = appViewModel.password();

        appViewModel.isAuthPending(true);
        fb.authWithPassword({ email, password }, (error, authData) => {
            appViewModel.isAuthPending(false);
            if (error) {
                appViewModel.isAuthenticated(false);
                appViewModel.authErrorMessage('Sikertelen bejelentkezés');
                return;
            }

            appViewModel.isAuthenticated(true);
            appViewModel.fetchLatestOrders();

            appViewModel.token(authData.token);
            appViewModel.uid(authData.uid);

            if (authData.password.isTemporaryPassword) {
                appViewModel.passwordChangeShown(true);
            }
        });
    },

    authWithToken: () => {
        appViewModel.isAuthPending(true);
        fb.authWithCustomToken(appViewModel.token(), error => {
            appViewModel.isAuthPending(false);
            if (error) {
                appViewModel.isAuthenticated(false);
                return;
            }

            appViewModel.isAuthenticated(true);
            appViewModel.fetchLatestOrders();
        });
    },

    showChangePasswordDialog: () => {
        appViewModel.passwordChangeShown(true);
    },

    changePassword: () => {
        fb.changePassword({ email: appViewModel.email(), oldPassword: appViewModel.oldPassword(), newPassword: appViewModel.newPassword() }, error => {
            if (error) {
                alert('Jelszóváltoztatás sikertelen!');
            }

            appViewModel.passwordChangeShown(false);
        });
    },

    cancelPasswordChange: () => {
        appViewModel.oldPassword('');
        appViewModel.newPassword('');
        appViewModel.passwordChangeShown(false);
    },

    resetPassword: () => {
        fb.resetPassword({ email: appViewModel.email() }, error => {
            if (error) {
                return appViewModel.authErrorMessage('Nem sikerült elküldeni a jelszóvisszaállító e-mailt. Biztos jó a cím?')
            }

            alert('Küldtünk egy e-mailt egy ideiglenes jelszóval.')
        });
    },

    logout: () => {
        fb.unauth();
        appViewModel.password('');
        appViewModel.token('');
        appViewModel.uid('');
        appViewModel.isAuthenticated(false);
    },

    fetchLatestOrders: () => {
    }
};

ko.applyBindings(appViewModel);

appViewModel.email.subscribe(email => {
    try { localStorage.authEmail = email; } catch(ex) {}
});

appViewModel.token.subscribe(token => {
    try { localStorage.authToken = token; } catch(ex) {}
});

appViewModel.uid.subscribe(uid => {
    try { localStorage.authUid = uid; } catch(ex) {}
});

try {
    if (localStorage.authEmail) {
        appViewModel.email(localStorage.authEmail);
        appViewModel.uid(localStorage.authUid);
    }

    if (localStorage.authToken) {
        appViewModel.token(localStorage.authToken);
        appViewModel.authWithToken();
    }
} catch(ex) {

}

$('[data-loading]').attr('data-loading', 'false');

query.on('child_added', (snapshot, key) => {
    if (!key) { return; }

    const ordersnapshot = snapshot.val();
    const order = createOrder(key, ordersnapshot);
    appViewModel.orders.unshift(order);
    document.querySelector('#ping-sound').play();
});

//
// query.on('value', snapshot => {
//     const ordersnapshot = snapshot.val();
//     const orders = [];
//
//     for (let key in ordersnapshot) {
//         const order = createOrder(key, ordersnapshot[key]);
//         orders.push(order);
//     }
//
//     orders.reverse();
//
//     appViewModel.orders(orders);
//     // document.querySelector('#ping-sound').play();
//
//     // setTimeout(() => {
//     //     query.on('child_added', (x) => {
//     //         console.log('ADDED');
//     //         console.log(x.val());
//     //         orders.unshift(x.val())
//     //         document.querySelector('#ping-sound').play();
//     //     });
//     // });
// });
