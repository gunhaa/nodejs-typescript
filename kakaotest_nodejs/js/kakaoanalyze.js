
// kakao.init("apikey") 로 시작된다.
// function init(appKey){} 는 5746번째 줄에 존재한다.
//5745줄 init , kakao sdk 시작 메소드임
// apiRules() 의심스러움
function init(appKey) {
    if (UA.browser.msie && UA.browser.version.major < 11) {
        throw new KakaoError('Kakao.init: Unsupported browser');
    }
    if (isInitialized()) {
        throw new KakaoError('Kakao.init: Already initialized');
    }
    if (!isString(appKey)) {
        throw new KakaoError('Kakao.init: App key must be provided');
    }
    setAppKey(appKey);
    {
        this.Auth = Auth$1;
        // 로그인 정보에 대해서
        this.API = API$1;
        // makeModule의 리턴값이 share$1
        // init.Share의 프로퍼티 = Share$1
        this.Share = Share$1;
        this.Channel = Channel$1;
        this.Navi = Navi$1;
        this.Picker = Picker$1;
    }
}

var Share$1 = Share;
var Share = makeModule([sender, imageAPI]);

// 버튼 만드는 메소드
var sender = /*#__PURE__*/Object.freeze({
    __proto__: null,
    cleanup: cleanup$2,
    createCustomButton: createCustomButton,
    createDefaultButton: createDefaultButton,
    createScrapButton: createScrapButton,
    sendCustom: sendCustom,
    sendDefault: sendDefault,
    sendScrap: sendScrap
});

var imageAPI = /*#__PURE__*/Object.freeze({
    __proto__: null,
    deleteImage: deleteImage,
    scrapImage: scrapImage,
    uploadImage: uploadImage
});

function makeModule(subModules) {
    var merged = subModules.reduce(function (acc, methods) {
        return _objectSpread2(_objectSpread2({}, acc), methods);
    }, {});
    return _objectSpread2(_objectSpread2({}, merged), {}, {
        cleanup: function cleanup() {
            forEach(subModules, function (e) {
                return e.cleanup && e.cleanup();
            });
        }
    });
}

// 복사본을 만드는 메소드임
// target은 여러 객체를 받고,
// 맨 앞 객체에 뒤에걸 복사함 값이 같을 경우 덮어씀
function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}


// sendDefault 함수는 공유하기를 보내는 함수임
// 인자로 object를 받는다.
// key는 objectType : feed
// content : {대충 무슨 내용}
// buttons : 버튼 설정
// 3개의 설정을 받는다.
function sendDefault(settings) {
    // settings.objectType = "feed"
    // 둘다 false !"feed" || rule$3.objectTypes 의 프로퍼티는 [ 요청 방식 ] 이여서 falsy 값이 나옴
    if (!settings.objectType || !isOneOf(rules$3.objectTypes)(settings.objectType)) {
        throw new KakaoError("objectType should be one of (".concat(rules$3.objectTypes.join(', '), ")"));
    }

    var rule = rules$3["send".concat(capitalize(settings.objectType))];
    
    settings = processRules(settings, rule, 'Share.sendDefault');
    //settings 는 해당 입력에서 들어온다
    /*
     {
    objectType : 'feed',
    content : {내용},
    buttons : [{내용}]
     }*/
    
    // rule 변수는 해당 값과 같다.
    /*
    var rule = sendFeed = {
        required: {
            objectType: function objectType(type) {
                return type === 'feed';
            },
            content: isObjectLike
        },
        optional: _objectSpread2(_objectSpread2({}, commonLinkOptional), {}, {
            itemContent: isObjectLike,
            social: isObjectLike,
            buttonTitle: isString,
            buttons: buttonsValidator
        }),
        defaults: commonLinkDefaults
    };
    */
          //processRules에서 params로 반환됨
    doSend(settings, 'default');
}
// settings 를 만드는 메소드
function processRules() {
    // (params, rules, callerMsg) 와 같은 상태임
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var rules = arguments.length > 1 ? arguments[1] : undefined;
    var callerMsg = arguments.length > 2 ? arguments[2] : undefined;
    // 에러 판정 원하는 자료형을 요구함
    if (!isObjectLike(params)) {
        throw new Error('params should be an Object');
    }
    if (isFunction(rules.before)) {
        rules.before(params);
    }
    if (isFunction(rules.defaults)) {
        defaults$1(params, rules.defaults(params));
    } else {
        defaults$1(params, rules.defaults);
    }

    // 여기가 제일 중요해서 다 해석해야함
    var _rules$required = rules.required, required = _rules$required === void 0 ? {} : _rules$required,
    /*
    required: {
        objectType: function objectType(type) {
            return type === 'feed';
        },
        content: isObjectLike
    }
    */
        _rules$optional = rules.optional,
        optional = _rules$optional === void 0 ? {} : _rules$optional;
    /*
    optional: _objectSpread2(_objectSpread2({}, commonLinkOptional), {}, {
        itemContent: isObjectLike,
        social: isObjectLike,
        buttonTitle: isString,
        buttons: buttonsValidator
    })
    */ 
    var missingRequiredKeys = difference(keys(required), keys(params));
    if (missingRequiredKeys.length > 0) {
        throw new KakaoError("Missing required keys: ".concat(missingRequiredKeys.join(','), " at ").concat(callerMsg));
    }

    var allowed = _objectSpread2(_objectSpread2({}, required), optional);
    /* 두 객체를 합친 변수가 allowed인 것 같음
    required: {
        objectType: function objectType(type) {
            return type === 'feed';
        },
        content: isObjectLike
    }
    */
       /*
    optional: _objectSpread2(_objectSpread2({}, commonLinkOptional), {}, {
        itemContent: isObjectLike,
        social: isObjectLike,
        buttonTitle: isString,
        buttons: buttonsValidator
    })

    var commonLinkOptional = {
        installTalk: isBoolean,
        throughTalk: isBoolean,
        extras: isObjectLike,
        serverCallbackArgs: passesOneOf([isJSONString, isObjectLike])
    };

    */ 

    var invalidKeys = difference(keys(params), keys(allowed));
    if (invalidKeys.length > 0) {
        throw new KakaoError("Invalid parameter keys: ".concat(invalidKeys.join(','), " at ").concat(callerMsg));
    }
    // 들어온 파라미터가 맞는지 판별하는 에러 판별 코드임
    forEach(params, function (value, key) {
        validate(value, allowed[key], "\"".concat(key, "\" in ").concat(callerMsg));
    });
    /* 현재 params의 값
     {
    objectType : 'feed',
    content : {내용},
    buttons : [{내용}]
     }*/

    if (isFunction(rules.after)) {
        rules.after(params);
    }
    return params;
}
//dosend 메소드
// 결국 이 메소드가 로그인화면 + 체크하는 화면의 실체
//processRules로 만들어진 params/ 'default'
//setting param은 processRules()로 만들어진다

 //processRules()=>return params; , 'default' 

            //params 는 , default
        /*  {
        objectType : 'feed',
        content : {내용},
        buttons : [{내용}]
            }*/
function doSend(settings, linkType) {
    var _linkTypeMapper$linkT = _slicedToArray(linkTypeMapper[linkType], 2),
        makeLinkFunc = _linkTypeMapper$linkT[0],
        requestUrl = _linkTypeMapper$linkT[1];
    var linkObj = makeLinkFunc(settings);
    if (isSupportTalkSharing(settings)) {

        talkSender.send(settings, requestUrl, linkObj);
    } else {
    //params , 'default' , makeLinkFunc()=> feedlink 만드는부분 같음
    //send$1.send(params)와 같은 메소드임
    // 전달되는 파라미터
/* 
            settings : 
            {
        objectType : 'feed',
        content : {내용},
        buttons : [{내용}]
            }
        linkType :  'default' 
        linkObj : 바로 위 settings object로 전달된다. 
    function makeDefaultLink(settings) {
        var clazz = defaultLinks["".concat(capitalize(settings.objectType), "Link")];
        
        결국 var clazz는
        let clazz =  DefaultLink = _createClass(function DefaultLink(settings) {
        var _this = this;
        _classCallCheck(this, DefaultLink);
        this.link_ver = LINK_VER;
        this.template_object = _objectSpread2({
            object_type: settings.objectType
        }, settings.buttonTitle && {
            button_title: settings.buttonTitle
        });
        forEach(settings, function (setting, key) {
            var prop = propGenerator.create(setting, key, 'defaultObject');
            if (prop) {
                _this.template_object[camelToSnakeCase(key)] = prop;
            }
        });
        });

        
        return new clazz(settings);
    }
        결과는
    {
    link_ver: LINK_VER, // 상수의 값으로 설정됨(4.0)
    template_object: {
        object_type: 'feed',
        content: prop_for_content,  // propGenerator.create가 반환한 값
        buttons: prop_for_buttons  // propGenerator.create가 반환한 값
    }
}
    


*/                
        webSender.send(settings, linkType, linkObj);
    }
}

var webSender = {
    send: send$1
};

var linkTypeMapper = {
    "default": [makeDefaultLink, '/v2/api/kakaolink/talk/template/default'],
    //  scrap: [makeScrapLink, '/v2/api/kakaolink/talk/template/scrap'],
    //  custom: [makeCustomLink, '/v2/api/kakaolink/talk/template/validate']
};

function makeDefaultLink(settings) {
    var clazz = defaultLinks["".concat(capitalize(settings.objectType), "Link")];
    return new clazz(settings);
}

var defaultLinks = {
    FeedLink: DefaultLink,
    CommerceLink: DefaultLink,
    ListLink: ListLink,
    LocationLink: LocationLink,
    CalendarLink: CalendarLink,
    TextLink: TextLink
};

var DefaultLink = _createClass(function DefaultLink(settings) {
    var _this = this;
    _classCallCheck(this, DefaultLink);
    this.link_ver = LINK_VER;
    this.template_object = _objectSpread2({
        object_type: settings.objectType
    }, settings.buttonTitle && {
        button_title: settings.buttonTitle
    });
    forEach(settings, function (setting, key) {
        var prop = propGenerator.create(setting, key, 'defaultObject');
        if (prop) {
            _this.template_object[camelToSnakeCase(key)] = prop;
        }
    });
});

function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
        var _s,
            _e,
            _x,
            _r,
            _arr = [],
            _n = !0,
            _d = !1;
        try {
            if (_x = (_i = _i.call(arr)).next, 0 === i) {
                if (Object(_i) !== _i) return;
                _n = !1;
            } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
        } catch (err) {
            _d = !0, _e = err;
        } finally {
            try {
                if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
            } finally {
                if (_d) throw _e;
            }
        }
        return _arr;
    }
}

function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}


function send(settings, requestUrl, linkObj) {
    return requestAPI(requestUrl, linkObj).then(function (validatedResp) {
        var linkSchemeParams = makeKakaoLink(settings, validatedResp);
        callWeb2app$2(linkSchemeParams, settings.installTalk);
    })["catch"](function (kapiError) {
        var error = JSON.stringify(_objectSpread2({
            name: 'KAPIError'
        }, kapiError));
        location.href = "".concat(URL.sharerDomain, "/picker/failed?app_key=").concat(getAppKey$1(), "&error=").concat(base64url(error));
    });
}

/* 
            settings : 
            {
        objectType : 'feed',
        content : {내용},
        buttons : [{내용}]
            }
        linkType :  'default' 

        linkObj : {
    link_ver: LINK_VER, // 상수의 값으로 설정됨(4.0)
    template_object: {
        object_type: 'feed',
        content: prop_for_content,  // propGenerator.create가 반환한 값
        buttons: prop_for_buttons  // propGenerator.create가 반환한 값
    }
*/

function send$1(settings, linkType, linkObj) {
    var webLinkParams = _objectSpread2({
        app_key: getAppKey$1(),
        ka: KAKAO_AGENT,
        validation_action: linkType,
        validation_params: JSON.stringify(linkObj)
    }, settings.serverCallbackArgs && {
        lcba: stringifyLCBA(settings.serverCallbackArgs)
    });
    // https://sharer.kakao.com + /picker/link

    // var webLinkParams = _objectSpread2({
    //     app_key: getAppKey$1(),
    //     ka: KAKAO_AGENT,
    //     validation_action: linkType,
    //     validation_params: JSON.stringify(linkObj)
    // }, settings.serverCallbackArgs && {
    //     lcba: stringifyLCBA(settings.serverCallbackArgs)
    // });
    // 이 부분이 중요한부분같음
    return submitFormWithPopup("".concat(URL.sharerDomain, "/picker/link"), webLinkParams, 'sharer');
}

function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}

// url :  https://sharer.kakao.com + /picker/link
//params : webLikeParams 부분인데, qs를 만드는 부분 같음-> 여기서 틀렸어.. {}로 세부 설정 전달함
//popupName : 'sharer'
// popupFeatures는 여기서 추가된 파라미터임
// 없으면 makeLinkFunc()를 이용해서 만들어옴
// return ["width=".concat(width), "height=".concat(height), "left=".concat(screen.width / 2 - width / 2 + sLeft), "top=".concat(screen.height / 2 - height / 2 + sTop), 'scrollbars=yes', 'resizable=1'].join(',');
// window의 설정을 읽어서 적절한 크기를 만들어온다.
                            //webLinkParams가 들어온다 , 'sharer' , feature는 안들어왔음
function submitFormWithPopup(url, params, popupName, popupFeatures) {
    var popup = UA.browser.msie ? {} : windowOpen(url, popupName, popupFeatures || getPopupFeatures());
    // 익스플로러 일시 빈 객체를 반환한다.. 아니라면 windowOpen함수를 실행해 popup에 할당한다.
    if (popup.focus) {
        popup.focus();
    }
    // 팝업 폼의 숨겨진 인풋을 만드는 메소드 제출도 함
    submitForm(url, params, popupName);
    // windowOpen()를 활성화 시키는 변수같음
    return popup;
    // 팝업 객체를 존재하게 만들어서 다른 함수를 활성화 시킨다.
    // name프로퍼티가 존재하는 팝업객체가 되는거 같음

}

// name은 'sharer'임.. property가 된다
function windowOpen(url, name, feature) {
    var popupWindow = popupWindows[name];
    if (popupWindow && popupWindow.close && !popupWindow.closed) {
        popupWindow.close();
    }
    popupWindows[name] = window.open(url, name, feature);
    return popupWindows[name];
}

//윈도우에 따른 팝업 크기 반환
function getPopupFeatures() {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 480;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 700;
    var sLeft = window.screenLeft ? window.screenLeft : window.screenX ? window.screenX : 0;
    var sTop = window.screenTop ? window.screenTop : window.screenY ? window.screenY : 0;
    return ["width=".concat(width), "height=".concat(height), "left=".concat(screen.width / 2 - width / 2 + sLeft), "top=".concat(screen.height / 2 - height / 2 + sTop), 'scrollbars=yes', 'resizable=1'].join(',');
}


// url :  https://sharer.kakao.com + /picker/link
//params : webLikeParams 부분인데, qs를 만드는 부분 같음
//popupName : 'sharer', 여기서는 argument[2]로 표현된다.
// qs에 오는 파라미터를 히든 인풋창에 넣어 폼으로 만들어내는 함수
function submitForm(url, params) {
    // true           AND      존재함
    // sharer가 유지된다..
    var popupName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '_self';
    // 일반적인 경우 sharer가 전달되어서 _self가 되지 않는다.
    var form = document.createElement('form');
    form.setAttribute('accept-charset', 'utf-8');
    form.setAttribute('method', 'post');
    form.setAttribute('action', url);
    form.setAttribute('target', popupName);
    form.setAttribute('style', 'display:none');

    // forEach(파라미터, 함수라면 함수를 실행하라/아니라면 identity함수의 좌표를 부여함)
    // 다시 한번 보기, forEach함수는 
    // 파라미터로 (배열, 콜백) 을 받아 실행한다.
    // 파라미터로 input박스를 만들고 그것을 넣는 함수임
    forEach(params, function (value, key) {
        // hidden input을 만든다, name=key, type=hidden, value
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = isString(value) ? value : JSON.stringify(value);
        form.appendChild(input);
    });

    function forEach(collection, iteratee) {
        var func = isArray$1(collection) ? arrayEach : baseEach$1;
        return func(collection, castFunction(iteratee));
    }

    function arrayEach(array, iteratee) {
        var index = -1,
            length = array == null ? 0 : array.length;
        while (++index < length) {
            if (iteratee(array[index], index, array) === false) {
                break;
            }
        }
        return array;
    }

    function castFunction(value) {
        return typeof value == 'function' ? value : identity;
    }



    document.body.appendChild(form);
    // 여기네 제출하면 리턴값으로 화면을 만들어주는거 같음.. 불가능
    form.submit();
    document.body.removeChild(form);
}


//***************************************************** 여기부터
// return popup; 이용해서 다른 무언가를 진행할 수 있음.. 로그인쪽이 열릴 거 같음 
// rules$6 함수를 확인해야함
// 2214줄 authorize 함수 확인


// 클릭이 된다 -> islogin -> 비로그인 -> 로그인(GET) -> 로그인 정보를 이용해서? popup name에 맞는 창을 띄운다.
//                           -> 로그인   -> popup name에 맞는 창을 띄운다

function openLoginPopup(url) {
    var LOGIN_POPUP_NAME = '_blank';
    return windowOpen(url, LOGIN_POPUP_NAME, getPopupFeatures());
}

// 의심되는애들
// requestAgt()
//---------------------- requestAgt() ----------------------
// popup 객체를 사용하는 함수
//만들어진 팝업객체가 존재함
// requestAgt()는 promise가 리턴됨 .then을 확인해야 한다.
function requestAgt(transId, popup, returnUrl) {
    var data = buildQueryString({
        client_id: getAppKey$1(),
        access_token: getAccessToken()
    });
    return httpRequest({
        method: 'POST',
        //"https://kauth.kakao.com"
        url: "".concat(URL.authDomain, "/api/agt"),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    })["catch"](function (e) {
        var errorUrl = handleAgtError(e, transId);
        if (popup) {
            popup.location = errorUrl;
        } else {
            location.href = errorUrl + "&return_url=".concat(encodeURIComponent(returnUrl));
        }
    });
}

// 만든 비동기 통신 전용 함수
// _xhr/httpRequest 있음
function httpRequest(config) {
    return new es6PromiseExports.Promise(function (resolve, reject) {
        _xhr(config, function (_ref) {
            var status = _ref.status,
                response = _ref.response;
            var parsed = parseResponse(response);
            status === 200 ? resolve(parsed) : reject(parsed);
        });
    });
}


