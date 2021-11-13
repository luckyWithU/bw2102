"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAccountItems = useAccountItems;
exports.$status = exports.$state = void 0;

var _recoil = require("recoil");

var _script = require("../flow/script.get-account-items");

var _constants = require("../global/constants");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var $state = (0, _recoil.atomFamily)({
  key: "account-items::state",
  "default": (0, _recoil.selectorFamily)({
    key: "account-items::default",
    get: function get(address) {
      return function _callee() {
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", (0, _script.fetchAccountItems)(address));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        });
      };
    }
  })
});
exports.$state = $state;
var $status = (0, _recoil.atomFamily)({
  key: "account-items::status",
  "default": _constants.IDLE
});
exports.$status = $status;

function useAccountItems(address) {
  var _useRecoilState = (0, _recoil.useRecoilState)($state(address)),
      _useRecoilState2 = _slicedToArray(_useRecoilState, 2),
      items = _useRecoilState2[0],
      setItems = _useRecoilState2[1];

  var _useRecoilState3 = (0, _recoil.useRecoilState)($status(address)),
      _useRecoilState4 = _slicedToArray(_useRecoilState3, 2),
      status = _useRecoilState4[0],
      setStatus = _useRecoilState4[1];

  return {
    ids: items,
    status: status,
    mint: function mint(data) {
      return regeneratorRuntime.async(function mint$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              setStatus(_constants.PROCESSING);
              _context2.next = 3;
              return regeneratorRuntime.awrap(fetch(process.env.REACT_APP_API_BW_ITEM_MINT, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  recipient: data.address,
                  name: data.name,
                  color: data.color,
                  imageUrl: data.imageUrl,
                  info: data.info,
                  quantity: data.quantity,
                  series: data.series //typeID: Math.floor(Math.random() * (5 - 1)) + 1,

                })
              }));

            case 3:
              _context2.next = 5;
              return regeneratorRuntime.awrap((0, _script.fetchAccountItems)(address).then(setItems));

            case 5:
              setStatus(_constants.IDLE);

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      });
    },
    refresh: function refresh() {
      return regeneratorRuntime.async(function refresh$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              setStatus(_constants.PROCESSING);
              _context3.next = 3;
              return regeneratorRuntime.awrap((0, _script.fetchAccountItems)(address).then(setItems));

            case 3:
              setStatus(_constants.IDLE);

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  };
}