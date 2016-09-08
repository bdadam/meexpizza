import store from './store';

const updateDate = () => store.dispatch({ type: 'set-current-date', date: new Date() });

export const init = () => {
    setInterval(updateDate, 1000);
    updateDate();
};

export const openingHoursReducer = (state = { isOpen: false }, action) => {
    if (action.type !== 'set-current-date') {
        return state;
    }

    const openingHoursPerDay = [
        [1030, 2030], // Sunday
        [1030, 2130],
        [1030, 2130],
        [1030, 2130],
        [1030, 2130],
        [1030, 2230],
        [1030, 2230]
    ];

    const currentDay = action.date.getDay();
    const nextDay = (currentDay + 1) % 7;
    const currentTime = action.date.getHours() * 100 + action.date.getMinutes();
    const currentOpeningHours = openingHoursPerDay[currentDay];
    const isOpen = currentTime >= currentOpeningHours[0] && currentTime <= currentOpeningHours[1];

    const daysOfWeek = [
        'vasárnap',
        'hétfő',
        'kedd',
        'szerda',
        'csütörtök',
        'péntek',
        'szombat',
    ];

    const nextOpenDay = currentTime <= currentOpeningHours[0] ? currentDay : nextDay;
    const nextOpenTime = openingHoursPerDay[nextOpenDay][0];
    const nextOpenHours = nextOpenTime / 100 | 0;
    const nextOpenMinutes = nextOpenTime - nextOpenHours * 100;

    const nextOpen = isOpen
            ? null
            : `${daysOfWeek[nextOpenDay]} ${nextOpenHours}:${nextOpenMinutes}`;

    return { isOpen, nextOpen };
};
