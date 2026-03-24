export function getFreeDeliveryTill() {
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const today = new Date().getDate();
        const lastDay = new Date(year, month + 1, 0).getDate();
        const randomDay = Math.floor(Math.random() * (lastDay - today + 1)) + today;
        const deliveryDay = new Date(year, month, randomDay).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
        return deliveryDay
    }

