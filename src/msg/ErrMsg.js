/**
 * UIConsult Error Messages
 */

const ErrMsg = {
    OPTION_INVALID_FORMAT : option => `Error: format of "${option}" is invalid`,
    OPTION_OUT_OF_RANGE   : option => `Error: "${option}" is out Of range`,
    IO_FAILED_TO_READ     : path   => `Error: failed to read "${path}"`,
    IO_PERMISSION_DENIED  : path   => `Error: permission denied "${path}"`,
    PATH_INVALID_EXT      : option => `Error: path extension denied "${option}"`
};

module.exports = ErrMsg;