module.exports = {
    classicpizza: {
        name: 'Klasszikus pizzák',
        items: [
            { name: 'Pizzakenyér', size: '30cm', price: 500, text:'' },
            { name: 'Sajtos-fokhagymás pizzakenyér', size: '30cm', price: 600, text: 'sajt, fokhagyma, fűszerkeverék' },
            { name: 'Margarita pizza', variants: { '30cm': 850, '40cm': 1850, '50cm': 2700 }, text: 'fűszeres paradicsom szósz, sajt' },
        ]
    },
    extrapizza: {
        name: 'Extra pizzák',
        items: [
            { name: 'Tonhalas pizza', text: 'fűszeres paradicsom szósz, sajt, vöröshagyma, citrom, capribogyó, toszkánai tonhalgerezdek', size: '30cm', price: 1190 },
            { name: 'Piedone pizza', text: 'fűszeres paradicsom szósz, sajt, hagyma, fehér és vörös óriásbab, pirított bacon, csípős cseresznyepaprika', size: '30cm', price: 1190 },
            { name: 'Jóasszony pizza', text: 'fűszeres paradicsomos alap, sajt, paprikás szalámi, csípős cseresznyepaprika, csiperke gomba, hagyma', size: '30cm', price: 1190 },
        ]
    },
    full: {
        name: 'Full a fullban Pizzák',
        items: [

        ]
    },
    pasta: {
        name: 'Tészták',
        items: [

        ]
    },
    meexspecial: {
        name: 'Meex specialitás',
        items: [

        ]
    },
    cheese: {
        name: 'Rántott sajtok',
        items: [

        ]
    },
    fresh: {
        name: 'Frissensültek',
        items: [

        ]
    },
    streetfood: {
        name: 'Hamburgerek (street food)',
        items: [

        ]
    },
    combi: {
        name: 'Hamburger menük',
        items: [

        ]
    },
    sandwich: {
        name: 'Fitnesz szendvics',
        items: [

        ]
    },
    salads: {
        name: 'Saláták',
        items: [

        ]
    },
    sweets: {
        name: 'Édesség',
        items: [
            { name: 'Profiterol', text: 'Profiterol golyók fehér- és tejcsokoládé bevonattal, tejszínhab koronával', price: 600 }
        ]
    },
    drinks: {
        name: 'Üdítők',
        items: [
            { name: 'Pepsi', variants: { '1,75 liter': 480, '1 liter': 350, '0,33 liter': 190 } },
            { name: 'Pepsi Max (light)', variants: { '1,75 liter': 480, '1 liter': 350, '0,33 liter': 190 } },
            { name: 'Mirinda', variants: { '1,75 liter': 480, '1 liter': 350, '0,33 liter': 190 } },
            { name: 'Canada Dry', variants: { '1,75 liter': 480, '1 liter': 350, '0,33 liter': 190 } },
            { name: 'Lipton Ice Tea', variants: { '0,33 liter': 190 } },

        ]
    },
    // largedrinks: {
    //     name: 'Üdítők 1,75 liter',
    //     items: [
    //         { name: 'Pepsi', price: 480 },
    //         { name: 'Pepsi Max (light)', price: 480 },
    //         { name: 'Mirinda', price: 480 },
    //         { name: 'Canada dry', price: 480 },
    //     ]
    // },
    // middledrinks: {
    //     name: 'Üdítők 1 liter',
    //     items: [
    //         { name: 'Pepsi', price: 350 },
    //         { name: 'Pepsi Max (light)', price: 350 },
    //         { name: 'Mirinda', price: 350 },
    //         { name: 'Canada dry', price: 350 },
    //     ]
    // },
    // smalldrinks: {
    //     name: 'Dobozos üdítők (0,33 liter)',
    //     items: [
    //         { name: 'Pepsi', price: 190 },
    //         { name: 'Pepsi Max (light)', price: 190 },
    //         { name: 'Mirinda', price: 190 },
    //         { name: 'Canada dry', price: 190 },
    //     ]
    // }
};


/*

var categories = [
    { id: 11, title: 'Pizzák' },
    { id: 12, title: 'Extra pizzák' },
    { id: 13, title: 'Full a fullban Pizzák' },
    { id: 14, title: 'Tészták' },
    { id: 15, title: 'Meex specialitás' },
    { id: 16, title: 'Rántott sajtok' },
    { id: 17, title: 'Frissensültek' },
    { id: 18, title: 'Hamburgerek (street food)' },
    { id: 19, title: 'Hamburger menük' },
    { id: 20, title: 'Fitnesz szendvics' },
    { id: 21, title: 'Saláták' },
    { id: 22, title: 'Édesség' },
    { id: 23, title: 'Üdítők' }
];


var pizza = {
    name: 'Margarita pizza',
    text: 'fűszeres paradicsom szósz, sajt',
    nr: 3,
    sizes: [30, 40, 50],
    prices: [850, 1850, 2700]
};


var pizzas = {
    title: "Pizzák",

};

var drinks = {
    title: "Üdítők",
    list: [
        { name: "1 literes", price: 350, options: ["Pepsi", "Pepsi Max (light)", "Mirinda", "Canada Dry"] },
        { name: "1.75 literes", price: 480, options: ["Pepsi", "Pepsi Max (light)", "Mirinda", "Canada Dry"] },
        { name: "Dobozos üdítők (0,33l)", price: 190, options: ["Pepsi", "Pepsi Max (light)", "Mirinda", "Canada Dry"] },
    ]
};
*/
