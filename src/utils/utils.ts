
export function getRandomBought(id : string) {
    const randomBoughtExists = localStorage.getItem(`${id}-randomBought`)
    if (randomBoughtExists) {
        return randomBoughtExists
    }
    const newRandomBought = (Math.random() * 5 + 1).toFixed(1)
    localStorage.setItem(`${id}-randomBought`, newRandomBought)
    return newRandomBought
}

export function getFreeDeliveryTill(id : string) {
    const deliveryDayExists = localStorage.getItem(`${id}-freeDeliveryUntil`)
    if (deliveryDayExists) {
        return deliveryDayExists
    }
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const today = new Date().getDate();
        const lastDay = new Date(year, month + 1, 0).getDate();
        const randomDay = Math.floor(Math.random() * (lastDay - today + 1)) + today;
        const deliveryDay = new Date(year, month, randomDay).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
        localStorage.setItem(`${id}-freeDeliveryUntil`, deliveryDay)
        return deliveryDay
    }

