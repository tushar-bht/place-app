const VALIDATOR_TYPE_REQUIRE = "REQUIRE";

const VALIDATOR_TYPE_MINLENGTH = "MINLENGTH";
const VALIDATOR_TYPE_MAXLENGTH = "MAXLENGTH";
const VALIDATOR_TYPE_MIN = "MIN";
const VALIDATOR_TYPE_MAX = "MAX";
const VALIDATOR_TYPE_EMAIL = "EMAIL";
const VALIDATOR_TYPE_FILE = "FILE";

const VALIDATOR_REQUIRE = () => ({
  type: VALIDATOR_TYPE_REQUIRE,
});
const VALIDATOR_FILE = () => ({
  type: VALIDATOR_TYPE_FILE,
});
const VALIDATOR_MINLENGTH = (val) => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  val: val,
});

const VALIDATOR_MAXLENGTH = (val) => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  val: val,
});
const VALIDATOR_MAX = (val) => ({
  type: VALIDATOR_TYPE_MAX,
  val: val,
});
const VALIDATOR_MIN = (val) => ({
  type: VALIDATOR_TYPE_MIN,
  val: val,
});

export function validate(value, validators) {
  let isValid = true;
  validators.forEach((element) => {
    if (element.type === VALIDATOR_TYPE_REQUIRE)
      isValid = isValid && value.trim().length > 0;
    if (element.type === VALIDATOR_TYPE_MINLENGTH)
      isValid = isValid && value.trim().length >= element.val;
    if (element.type === VALIDATOR_TYPE_MAXLENGTH)
      isValid = isValid && value.trim().length <= element.val;
    if (element.type === VALIDATOR_TYPE_MAX)
      isValid = isValid && +value <= element.val;
    if (element.type === VALIDATOR_TYPE_MIN)
      isValid = isValid && +value >= element.val;
    if (element.type === VALIDATOR_TYPE_EMAIL)
      isValid = isValid && /^\$+\.\$+S+$/.test(value);
  });

  return isValid;
}
export {
  VALIDATOR_MAX,
  VALIDATOR_MIN,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_FILE,
  VALIDATOR_REQUIRE,
};
