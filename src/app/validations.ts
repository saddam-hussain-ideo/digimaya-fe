declare var $: any;
export class Validations {
  verifyNameInputs(name) {
    name = $.trim(name);

    if (name == undefined || name == '' || name.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const checkresult = re.test(email);
    return checkresult;
  }

  validatePhone(phone) {
    const re = /^\+[1-9]\d{6,14}$/;
    const checkresult = re.test(phone);
    return checkresult;
  }

  verifyNameRegex(name) {
    if (!/[^a-zA-Z ]/.test(name)) {
      return true;
    } else {
      return false;
    }
  }

  toCommas(x) {
    const parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');

    /*  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); */
  }

  toConcat(x) {
    if (x.includes(',')) {
      const value = x.split(',');
      return value[0].concat(value[1]);
    } else {
      return x;
    }
  }
  convertToLiterals(value, dp) {
    dp = !dp ? 8 : 2;
    // Nine Zeroes for Billions
    return Math.abs(Number(value)) >= 1.0e9
      ? (Math.abs(Number(value)) / 1.0e9).toFixed(8) + ' B'
      : // Six Zeroes for Millions
        Math.abs(Number(value)) >= 1.0e6
        ? (Math.abs(Number(value)) / 1.0e6).toFixed(8) + ' M'
        : // Three Zeroes for Thousands
          Math.abs(Number(value)) >= 1.0e3
          ? (Math.abs(Number(value)) / 1.0e3).toFixed(8) + ' K'
          : Math.abs(Number(value)).toFixed(8);
  }

  public dt: any;
  public month: any;

  correctDateFormat(value) {
    if (value.day < 10) {
      value.day = '0' + value.day;
    }
    if (value.month < 10) {
      value.month = '0' + value.month;
    }

    return value.year + '-' + value.month + '-' + value.day;
  }

  verifyUserNameLength(username) {
    if (username.length < 3 || username.length > 50) {
      return false;
    } else {
      return true;
    }
  }
  verifyAffiliateCodeAndUsernmarLength(username) {
    if (username.length < 3 || username.length > 15) {
      return false;
    } else {
      return true;
    }
  }

  verifyUsername(username) {
    if (/^[A-Za-z0-9]+(?:_[A-Za-z0-9]+)*$/.test(username)) {
      return true;
    } else {
      return false;
    }
  }

  verifyPasswordLength(password) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,50}$/g;
    if (passwordRegex.test(password)) {
      return true;
    } else {
      return false;
    }
  }

  startTimer(duration) {
    let start = Date.now(),
      diff,
      minutes,
      seconds;
    function timer() {
      // get the number of seconds that have elapsed since
      // startTimer() was called
      diff = duration - (((Date.now() - start) / 1000) | 0);

      // does the same job as parseInt truncates the float
      minutes = (diff / 60) | 0;
      seconds = diff % 60 | 0;

      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      const time = minutes + ':' + seconds;

      if (diff <= 0) {
        // add one second so that the count down starts at the full duration
        // example 05:00 not 04:59
        start = Date.now() + 1000;
      }

      return time;
    }
    // we don't want to wait a full second before the timer starts
    timer();
    setInterval(timer, 1000);
  }

  public blockSpecialChar(e) {
    let k;
    e.keyCode ? (k = e.keyCode) : (k = e.which);
    // Allow uppercase letters, lowercase letters, space, backspace, and hyphen
    if (
      (k > 64 && k < 91) || // A-Z
      (k > 96 && k < 123) || // a-z
      k == 8 || // Backspace
      k == 32 || // Space
      k == 45 // Hyphen (-)
    ) {
      return true;
    }
    return false;
  }
}
