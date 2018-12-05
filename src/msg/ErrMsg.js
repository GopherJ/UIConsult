/**
 * UIConsult Error Messages
 */

const ErrMsg = {
    OPTION_FROM_TO        : (from, to) => `Error: start date should smaller than end date "${from}" "${to}"`,
    OPTION_INVALID_FORMAT : option => `Error: format of "${option}" is invalid`,
    OPTION_OUT_OF_RANGE   : option => `Error: "${option}" is out Of range`,
    OPTION_IS_REQUIRED    : option => `Error: missing required option "${option}"`,
    IO_FAILED_TO_READ     : path   => `Error: failed to read "${path}"`,
    IO_PERMISSION_DENIED  : path   => `Error: permission denied "${path}"`,
    PATH_INVALID_EXT      : option => `Error: path extension denied "${option}"`,
};

module.exports = ErrMsg;
