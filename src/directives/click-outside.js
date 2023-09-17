export const clickOutside = {
  mounted(el, binding) {
    let firstClick = true;
    const handleOutsideClick = (event) => {
      if (firstClick) {
        firstClick = false;
        return;
      }
      if (!el.contains(event.target) && el !== event.target) {
        setTimeout(() => {
          if (typeof binding.value === "function") {
            binding.value(event, el);
          } else {
            console.warn("`v-click-outside` expects a function value");
          }
        }, 0);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    el._clickOutsideEvent = handleOutsideClick;
  },
  unmounted(el) {
    document.removeEventListener("click", el._clickOutsideEvent);
  },
};

export default clickOutside;
