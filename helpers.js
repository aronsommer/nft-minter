// To start animation use: loadingAnimation(true);
// To stop animation use: loadingAnimation(false);
export function loadingAnimation(play) {
    let elements = document.querySelectorAll("hr");
    for (let i = 0; i < elements.length; i += 1) {
        if (play) {
            elements.item(i).style.animation = "hr-animation1 0.75s infinite";
            // elements.item(i).style.height = "5px";
        }
        if (!play) {
            elements.item(i).style.animation = "none";
            // elements.item(i).style.height = "1px";
        }
    }
}