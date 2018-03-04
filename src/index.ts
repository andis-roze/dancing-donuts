import { DonutContainer } from "./DonutContainer";

window.addEventListener("load", () => {
    if (window.applicationCache) {
        window.applicationCache.addEventListener("updateready", () => {
            if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
                // Browser downloaded a new app cache.
                // Swap it in and reload the page to get the new hotness.
                window.applicationCache.swapCache();
                if (confirm("A new version of this site is available. Load it?")) {
                    window.location.reload();
                }
            }
        }, false);
    }
}, false);

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement("canvas");
    const donutContainer = new DonutContainer(canvas);

    document.body.appendChild(canvas);
    donutContainer.run(Math.PI);
});
