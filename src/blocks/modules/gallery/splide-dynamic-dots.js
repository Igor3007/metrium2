export const scrollDynamicDots = (elem, container, speed = 'smooth') => {
    var rect = elem.getBoundingClientRect();
    var rectContainer = container.getBoundingClientRect();

    let elemOffset = {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
    }

    let containerOffset = {
        top: rectContainer.top + document.body.scrollTop,
        left: rectContainer.left + document.body.scrollLeft
    }

    let leftPX = elemOffset.left - containerOffset.left + container.scrollLeft - (container.offsetWidth / 2) + ((elem.offsetWidth + 0) / 2)

    // Полифилл для кастомной скорости скролла
    function smoothScrollTo(element, target, duration) {
        const start = element.scrollLeft;
        const change = target - start;
        const startTime = performance.now();

        function animateScroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // easing function - easeInOutQuad
            const easeProgress = progress < 0.5 ?
                2 * progress * progress :
                -1 + (4 - 2 * progress) * progress;

            element.scrollLeft = start + change * easeProgress;

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }

        requestAnimationFrame(animateScroll);
    }

    // Настройка скорости анимации
    const scrollOptions = {
        left: leftPX
    };

    if (typeof speed === 'number') {
        smoothScrollTo(container, leftPX, speed);
        return;
    } else {
        scrollOptions.behavior = 'smooth';
    }

    container.scrollTo(scrollOptions);
}
