"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _storeShape = require("react-redux/lib/utils/storeShape");

var _storeShape2 = _interopRequireDefault(_storeShape);

var _shallowEqual = require("react-redux/lib/utils/shallowEqual");

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _warning = require("react-redux/lib/utils/warning");

var _warning2 = _interopRequireDefault(_warning);

var _isPlainObject = require("lodash/isPlainObject");

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _hoistNonReactStatics = require("hoist-non-react-statics");

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultMapStateToProps = function defaultMapStateToProps(state) {
	return {};
}; // eslint-disable-line no-unused-vars
var defaultMergeProps = function defaultMergeProps(stateProps, dispatchProps, parentProps) {
	return _extends({}, parentProps, stateProps, dispatchProps);
};

function getDisplayName(WrappedComponent) {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

var errorObject = { value: null };
function tryCatch(fn, ctx) {
	try {
		return fn.apply(ctx);
	} catch (e) {
		errorObject.value = e;
		return errorObject;
	}
}

var nextVersion = 0;

function translatable(mapStateToProps, mapDispatchToProps, mergeProps) {
	var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	var shouldSubscribe = Boolean(mapStateToProps);
	var mapState = mapStateToProps || defaultMapStateToProps;
	var locale = null;

	var mapDispatch = void 0;
	mapDispatch = function mapDispatch(dispatch) {
		return {
			changeLocale: function changeLocale(locale) {
				dispatch({ type: "LOCALE_CHANGED", locale: locale });
			}
		};
	};

	var finalMergeProps = mergeProps || defaultMergeProps;
	var _options$pure = options.pure;
	var pure = _options$pure === undefined ? true : _options$pure;
	var _options$withRef = options.withRef;
	var withRef = _options$withRef === undefined ? false : _options$withRef;

	var checkMergedEquals = pure && finalMergeProps !== defaultMergeProps;

	// Helps track hot reloading.
	var version = nextVersion++;

	return function wrapWithTranslate(WrappedComponent) {
		var connectDisplayName = "Translated(" + getDisplayName(WrappedComponent) + ")";

		function checkStateShape(props, methodName) {
			if (!(0, _isPlainObject2.default)(props)) {
				(0, _warning2.default)(methodName + "() in " + connectDisplayName + " must return a plain object. " + ("Instead received " + props + "."));
			}
		}

		function computeMergedProps(stateProps, dispatchProps, parentProps) {
			var mergedProps = finalMergeProps(stateProps, dispatchProps, parentProps);
			if (process.env.NODE_ENV !== 'production') {
				checkStateShape(mergedProps, 'mergeProps');
			}
			return mergedProps;
		}

		var Translated = function (_Component) {
			_inherits(Translated, _Component);

			_createClass(Translated, [{
				key: "shouldComponentUpdate",
				value: function shouldComponentUpdate() {
					return !pure || this.haveOwnPropsChanged || this.hasStoreStateChanged;
				}
			}]);

			function Translated(props, context) {
				_classCallCheck(this, Translated);

				var _this = _possibleConstructorReturn(this, (Translated.__proto__ || Object.getPrototypeOf(Translated)).call(this, props, context));

				_this.version = version;
				_this.store = props.store || context.store;

				(0, _invariant2.default)(_this.store, "Could not find \"store\" in either the context or " + ("props of \"" + connectDisplayName + "\". ") + "Either wrap the root component in a <Provider>, " + ("or explicitly pass \"store\" as a prop to \"" + connectDisplayName + "\"."));

				var storeState = _this.store.getState();
				_this.state = { storeState: storeState };
				_this.clearCache();
				return _this;
			}

			_createClass(Translated, [{
				key: "computeStateProps",
				value: function computeStateProps(store, props) {
					if (!this.finalMapStateToProps) {
						return this.configureFinalMapState(store, props);
					}

					var locales = translatable.prototype.locales;
					var locale = locales[store.getState().locale];

					var state = store.getState();
					var stateProps = this.doStatePropsDependOnOwnProps ? this.finalMapStateToProps(locale, props) : this.finalMapStateToProps(locale);

					if (process.env.NODE_ENV !== 'production') {
						checkStateShape(stateProps, 'mapStateToProps');
					}

					return stateProps;
				}
			}, {
				key: "configureFinalMapState",
				value: function configureFinalMapState(store, props) {
					var locales = translatable.prototype.locales;
					var locale = locales[store.getState().locale];

					var mappedState = mapState(locale, props);

					var isFactory = typeof mappedState === 'function';

					this.finalMapStateToProps = isFactory ? mappedState : mapState;
					this.doStatePropsDependOnOwnProps = this.finalMapStateToProps.length !== 1;

					if (isFactory) {
						return this.computeStateProps(store, props);
					}

					if (process.env.NODE_ENV !== 'production') {
						checkStateShape(mappedState, 'mapStateToProps');
					}
					return mappedState;
				}
			}, {
				key: "computeDispatchProps",
				value: function computeDispatchProps(store, props) {
					if (!this.finalMapDispatchToProps) {
						return this.configureFinalMapDispatch(store, props);
					}

					var dispatch = store.dispatch;

					var dispatchProps = this.doDispatchPropsDependOnOwnProps ? this.finalMapDispatchToProps(dispatch, props) : this.finalMapDispatchToProps(dispatch);

					if (process.env.NODE_ENV !== 'production') {
						checkStateShape(dispatchProps, 'mapDispatchToProps');
					}
					return dispatchProps;
				}
			}, {
				key: "configureFinalMapDispatch",
				value: function configureFinalMapDispatch(store, props) {
					var mappedDispatch = mapDispatch(store.dispatch, props);
					var isFactory = typeof mappedDispatch === 'function';

					this.finalMapDispatchToProps = isFactory ? mappedDispatch : mapDispatch;
					this.doDispatchPropsDependOnOwnProps = this.finalMapDispatchToProps.length !== 1;

					if (isFactory) {
						return this.computeDispatchProps(store, props);
					}

					if (process.env.NODE_ENV !== 'production') {
						checkStateShape(mappedDispatch, 'mapDispatchToProps');
					}
					return mappedDispatch;
				}
			}, {
				key: "updateStatePropsIfNeeded",
				value: function updateStatePropsIfNeeded() {
					var nextStateProps = this.computeStateProps(this.store, this.props);
					if (this.stateProps && (0, _shallowEqual2.default)(nextStateProps, this.stateProps)) {
						return false;
					}

					this.stateProps = nextStateProps;
					return true;
				}
			}, {
				key: "updateDispatchPropsIfNeeded",
				value: function updateDispatchPropsIfNeeded() {
					var nextDispatchProps = this.computeDispatchProps(this.store, this.props);
					if (this.dispatchProps && (0, _shallowEqual2.default)(nextDispatchProps, this.dispatchProps)) {
						return false;
					}

					this.dispatchProps = nextDispatchProps;
					return true;
				}
			}, {
				key: "updateMergedPropsIfNeeded",
				value: function updateMergedPropsIfNeeded() {
					var nextMergedProps = computeMergedProps(this.stateProps, this.dispatchProps, this.props);
					if (this.mergedProps && checkMergedEquals && (0, _shallowEqual2.default)(nextMergedProps, this.mergedProps)) {
						return false;
					}

					this.mergedProps = nextMergedProps;
					return true;
				}
			}, {
				key: "isSubscribed",
				value: function isSubscribed() {
					return typeof this.unsubscribe === 'function';
				}
			}, {
				key: "trySubscribe",
				value: function trySubscribe() {
					if (shouldSubscribe && !this.unsubscribe) {
						this.unsubscribe = this.store.subscribe(this.handleChange.bind(this));
						this.handleChange();
					}
				}
			}, {
				key: "tryUnsubscribe",
				value: function tryUnsubscribe() {
					if (this.unsubscribe) {
						this.unsubscribe();
						this.unsubscribe = null;
					}
				}
			}, {
				key: "componentDidMount",
				value: function componentDidMount() {
					this.trySubscribe();
				}
			}, {
				key: "componentWillReceiveProps",
				value: function componentWillReceiveProps(nextProps) {
					if (!pure || !(0, _shallowEqual2.default)(nextProps, this.props)) {
						this.haveOwnPropsChanged = true;
					}
				}
			}, {
				key: "componentWillUnmount",
				value: function componentWillUnmount() {
					this.tryUnsubscribe();
					this.clearCache();
				}
			}, {
				key: "clearCache",
				value: function clearCache() {
					this.dispatchProps = null;
					this.stateProps = null;
					this.mergedProps = null;
					this.haveOwnPropsChanged = true;
					this.hasStoreStateChanged = true;
					this.haveStatePropsBeenPrecalculated = false;
					this.statePropsPrecalculationError = null;
					this.renderedElement = null;
					this.finalMapDispatchToProps = null;
					this.finalMapStateToProps = null;
				}
			}, {
				key: "handleChange",
				value: function handleChange() {
					if (!this.unsubscribe) {
						return;
					}

					var storeState = this.store.getState();
					var prevStoreState = this.state.storeState;
					if (pure && prevStoreState === storeState) {
						return;
					}

					if (pure && !this.doStatePropsDependOnOwnProps) {
						var haveStatePropsChanged = tryCatch(this.updateStatePropsIfNeeded, this);
						if (!haveStatePropsChanged) {
							return;
						}
						if (haveStatePropsChanged === errorObject) {
							this.statePropsPrecalculationError = errorObject.value;
						}
						this.haveStatePropsBeenPrecalculated = true;
					}

					this.hasStoreStateChanged = true;
					this.setState({ storeState: storeState });
				}
			}, {
				key: "render",
				value: function render() {
					var haveOwnPropsChanged = this.haveOwnPropsChanged;
					var hasStoreStateChanged = this.hasStoreStateChanged;
					var haveStatePropsBeenPrecalculated = this.haveStatePropsBeenPrecalculated;
					var statePropsPrecalculationError = this.statePropsPrecalculationError;
					var renderedElement = this.renderedElement;


					this.haveOwnPropsChanged = false;
					this.hasStoreStateChanged = false;
					this.haveStatePropsBeenPrecalculated = false;
					this.statePropsPrecalculationError = null;

					if (statePropsPrecalculationError) {
						throw statePropsPrecalculationError;
					}

					var shouldUpdateStateProps = true;
					var shouldUpdateDispatchProps = true;
					if (pure && renderedElement) {
						shouldUpdateStateProps = hasStoreStateChanged || haveOwnPropsChanged && this.doStatePropsDependOnOwnProps;
						shouldUpdateDispatchProps = haveOwnPropsChanged && this.doDispatchPropsDependOnOwnProps;
					}

					var haveStatePropsChanged = false;
					var haveDispatchPropsChanged = false;
					if (haveStatePropsBeenPrecalculated) {
						haveStatePropsChanged = true;
					} else if (shouldUpdateStateProps) {
						haveStatePropsChanged = this.updateStatePropsIfNeeded();
					}
					if (shouldUpdateDispatchProps) {
						haveDispatchPropsChanged = this.updateDispatchPropsIfNeeded();
					}

					var haveMergedPropsChanged = true;
					if (haveStatePropsChanged || haveDispatchPropsChanged || haveOwnPropsChanged) {
						haveMergedPropsChanged = this.updateMergedPropsIfNeeded();
					} else {
						haveMergedPropsChanged = false;
					}

					if (!haveMergedPropsChanged && renderedElement) {
						return renderedElement;
					}

					if (withRef) {
						this.renderedElement = (0, _react.createElement)(WrappedComponent, _extends({}, this.mergedProps, {
							ref: 'wrappedInstance'
						}));
					} else {
						this.renderedElement = (0, _react.createElement)(WrappedComponent, this.mergedProps);
					}

					return this.renderedElement;
				}
			}]);

			return Translated;
		}(_react.Component);

		Translated.displayName = connectDisplayName;
		Translated.WrappedComponent = WrappedComponent;
		Translated.contextTypes = {
			store: _storeShape2.default
		};
		Translated.propTypes = {
			store: _storeShape2.default
		};

		if (process.env.NODE_ENV !== 'production') {
			Translated.prototype.componentWillUpdate = function componentWillUpdate() {
				if (this.version === version) {
					return;
				}

				// We are hot reloading!
				this.version = version;
				this.trySubscribe();
				this.clearCache();
			};
		}

		return (0, _hoistNonReactStatics2.default)(Translated, WrappedComponent);
	};
}
translatable.prototype.locales = {};

exports.default = translatable;