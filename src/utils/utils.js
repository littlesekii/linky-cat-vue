const utils = {
  debounce: function (func, delay) {
    let timeoutId;
    
    return function() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this);
      }, delay);
    };
  }
};

export default utils;