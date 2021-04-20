var MK_KEYBOARD = function (selector, languageSwitcherSelector, url) {
    /*Retrive input element*/
    MK_KEYBOARD.$textElements = jQuery(selector);
    /*Retrive language switch*/
    MK_KEYBOARD.$languages = jQuery(languageSwitcherSelector);

    MK_KEYBOARD.$currentLanguage = null;
    MK_KEYBOARD.$currentTextElement = null;

    MK_KEYBOARD.keyboardState = 0; /*0=Hidden - 1=Visible*/
    MK_KEYBOARD.keyboardAction = url;
    MK_KEYBOARD.keyboardHTML = {};

    MK_KEYBOARD.$languages.change(function (e) {

        var $current = jQuery(this);

        MK_KEYBOARD.$currentLanguage = ($current.prop("checked")) ? $current : null;

        MK_KEYBOARD.$languages.each(function () {
            var $iterElement = jQuery(this);
            if (!$current.is($iterElement)) {
                $iterElement.prop("checked", false);
            }
        });

        if (MK_KEYBOARD.$currentLanguage != null && MK_KEYBOARD.keyboardState == 1) {
            jQuery("#draggableKey").slideUp('fast', function () {
                jQuery("#draggableKey").remove();
                MK_KEYBOARD.keyboardState = 0;
                MK_KEYBOARD.$currentTextElement.focus();
            });
        }

    });


    /*Register for text update*/
    MK_KEYBOARD.$textElements.each(function () {
        jQuery(this).keyup(MK_KEYBOARD.translateChar);
        jQuery(this).focus(MK_KEYBOARD.showKeyBoard);
    });

};

MK_KEYBOARD.closeOpenKeyboard = function () {
    jQuery("#draggableKey").slideUp('fast', function () {
        jQuery("#draggableKey").remove();
        MK_KEYBOARD.keyboardState = 0;
    });
};


MK_KEYBOARD.prototype.destroy = function () {
    MK_KEYBOARD.closeOpenKeyboard();
    MK_KEYBOARD.$textElements.each(function () {
        jQuery(this).unbind('keyup', MK_KEYBOARD.translateChar);
        jQuery(this).unbind('focus', MK_KEYBOARD.showKeyBoard);
    });
};

MK_KEYBOARD.drawSelectedChar = function (item) {
    var car = MK_KEYBOARD.$currentTextElement.val();
    car = car + item;
    MK_KEYBOARD.$currentTextElement.val(car);
};


MK_KEYBOARD.showKeyBoard = function () {
    MK_KEYBOARD.$currentTextElement = jQuery(this);
    if (MK_KEYBOARD.$currentLanguage == null || MK_KEYBOARD.keyboardState == 1) {
        return;
    }
    /*Get Language*/
    var language = MK_KEYBOARD.$currentLanguage.data('keylanguage');
    var showKeyBoardMethod = 'showKeyBoard' + language.toUpperCase();
    MK_KEYBOARD[showKeyBoardMethod]();
    MK_KEYBOARD.keyboardState = 1;
};


MK_KEYBOARD.showKeyBoardGREEK = function () {
    if (MK_KEYBOARD.keyboardHTML['greek'] == undefined)
        MK_KEYBOARD.updateKeyBoard('greek', false);
    var html = '<div  id="draggableKey" class="ui-widget-content">' + MK_KEYBOARD.keyboardHTML['greek'] + '</div>';
    MK_KEYBOARD.$currentTextElement.after(html);
    jQuery("#draggableKey").draggable();
};


MK_KEYBOARD.showKeyBoardHEBREW = function () {
    if (MK_KEYBOARD.keyboardHTML['hebrew'] == undefined)
        MK_KEYBOARD.updateKeyBoard('hebrew', false);
    var html = '<div  id="draggableKey" class="ui-widget-content">' + MK_KEYBOARD.keyboardHTML['hebrew'] + '</div>';
    MK_KEYBOARD.$currentTextElement.after(html);
    jQuery("#draggableKey").draggable();
};


MK_KEYBOARD.updateKeyBoard = function (keyboard_string_name, async) {
    async = (async != undefined) ? async : true;
    jQuery.ajax({
        type: 'POST',
        url: MK_KEYBOARD.keyboardAction,
        dataType: 'json',
        async: async,
        data: 'type=' + keyboard_string_name,
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 200) {
                alert('Search engine temporary down for maintenance. Please try again later. Apologies for the inconvenience');
            } else {
                alert('Error parsing you request!\nPlease report this bug at https://github.com/EAGLE-BPN/Inscription-Search-Engine');
            }
        },
        success: function (data) {
            if (!data.error)
                MK_KEYBOARD.keyboardHTML[keyboard_string_name] = data.html;
        }
    });
};


MK_KEYBOARD.translateChar = function () {
    if (MK_KEYBOARD.$currentLanguage == null) {
        return;
    }
    /*Get Language*/
    var language = MK_KEYBOARD.$currentLanguage.data('keylanguage');
    var translateMethod = 'translateChar2' + language.toUpperCase();
    MK_KEYBOARD[translateMethod]();
};


MK_KEYBOARD.translateChar2GREEK = function () {
    var car = MK_KEYBOARD.$currentTextElement.val();
    car = car.replace(/’/g, "\'");
    car = car.replace(/j/g, "η");
    car = car.replace(/h/g, "-");
    car = car.replace(/a/g, "α");
    car = car.replace(/α'/g, "ά");
    car = car.replace(/ά'/g, "ὰ");
    car = car.replace(/ὰ'/g, "ᾰ");
    car = car.replace(/ᾰ'/g, "ᾱ");
    car = car.replace(/ᾱ'/g, "α");

    car = car.replace(/α=/g, "ᾳ");
    car = car.replace(/ᾳ'/g, "ᾴ");
    car = car.replace(/ᾴ'/g, "ᾲ");
    car = car.replace(/ᾲ'/g, "ᾴ");
    car = car.replace(/ά=/g, "ᾴ");
    car = car.replace(/ὰ=/g, "ᾲ");
    car = car.replace(/α&/g, "ᾶ");
    car = car.replace(/ᾳ&/g, "ᾷ");
    car = car.replace(/[àâä]/g, "ά");
    car = car.replace(/-α/g, "ἁ");
    car = car.replace(/-ἁ/g, "ἀ");
    car = car.replace(/-ᾳ/g, "ᾁ");
    car = car.replace(/-ᾁ/g, "ᾀ");
    car = car.replace(/b/g, "β");
    car = car.replace(/β=/g, "ϐ");
    car = car.replace(/c/g, "κ");
    car = car.replace(/κ-/g, "χ");
    car = car.replace(/d/g, "δ");
    car = car.replace(/e/g, "ε");
    car = car.replace(/é/g, "έ");
    car = car.replace(/ε'/g, "έ");
    car = car.replace(/έ'/g, "ὲ");
    car = car.replace(/ὲ'/g, "ε");
    car = car.replace(/-ε/g, "ἑ");
    car = car.replace(/-ἑ/g, "ἐ");
    car = car.replace(/f/g, "φ");
    car = car.replace(/π-/g, "φ");
    car = car.replace(/φ=/g, "ϕ");
    car = car.replace(/g/g, "γ");
    car = car.replace(/[èê]/g, "η");
    car = car.replace(/η'/g, "ή");
    car = car.replace(/ή'/g, "ὴ");
    car = car.replace(/ὴ'/g, "η");
    car = car.replace(/η=/g, "ῃ");
    car = car.replace(/ῃ'/g, "ῄ");
    car = car.replace(/ῄ'/g, "ῂ");
    car = car.replace(/ῂ'/g, "ῃ");
    car = car.replace(/ή=/g, "ῄ");
    car = car.replace(/ὴ=/g, "ῂ");
    car = car.replace(/η&/g, "ῆ");
    car = car.replace(/-η/g, "ἡ");
    car = car.replace(/-ἡ/g, "ἠ");
    car = car.replace(/ῃ&/g, "ῇ");
    car = car.replace(/-ῃ/g, "ᾑ");
    car = car.replace(/-ᾑ/g, "ᾐ");
    car = car.replace(/i/g, "ι");
    car = car.replace(/ι'/g, "ί");
    car = car.replace(/ί'/g, "ὶ");
    car = car.replace(/ὶ'/g, "ῐ");
    car = car.replace(/ῐ'/g, "ῑ");
    car = car.replace(/ῑ'/g, "ι");

    car = car.replace(/ι&/g, "ῖ");
    car = car.replace(/-ι/g, "ἱ");
    car = car.replace(/-ἱ/g, "ἰ");
    car = car.replace(/x/g, "ξ");
    car = car.replace(/k/g, "κ");
    car = car.replace(/κ=/g, "ϰ");
    car = car.replace(/l/g, "λ");
    car = car.replace(/m/g, "μ");
    car = car.replace(/n/g, "ν");
    car = car.replace(/o/g, "ο");
    car = car.replace(/ο'/g, "ό");
    car = car.replace(/ό'/g, "ὸ");
    car = car.replace(/ὸ'/g, "ο");
    car = car.replace(/-ο/g, "ὁ");
    car = car.replace(/-ὁ/g, "ὀ");
    car = car.replace(/p/g, "π");
    car = car.replace(/r/g, "ρ");
    car = car.replace(/ρ'/g, "ῥ");
    car = car.replace(/ῥ'/g, "ῤ");
    car = car.replace(/ῤ'/g, "ρ");
    car = car.replace(/s/g, "σ");
    car = car.replace(/σ=/g, "ς");
    car = car.replace(/t/g, "τ");
    car = car.replace(/u/g, "υ");
    car = car.replace(/ù/g, "ύ");
    car = car.replace(/û/g, "ύ");
    car = car.replace(/υ'/g, "ύ");
    car = car.replace(/ύ'/g, "ὺ");
    car = car.replace(/ὺ'/g, "ῠ");
    car = car.replace(/ῠ'/g, "ῡ");
    car = car.replace(/ῡ'/g, "υ");

    car = car.replace(/υ&/g, "ῦ");
    car = car.replace(/-υ/g, "ὑ");
    car = car.replace(/-ὑ/g, "ὐ");
    car = car.replace(/w/g, "ω");
    car = car.replace(/ô/g, "ω");
    car = car.replace(/ω'/g, "ώ");
    car = car.replace(/ώ'/g, "ὼ");
    car = car.replace(/ὼ'/g, "ω");
    car = car.replace(/ω=/g, "ῳ");
    car = car.replace(/ῳ'/g, "ῴ");
    car = car.replace(/ῴ'/g, "ῲ");
    car = car.replace(/ῲ'/g, "ῳ");
    car = car.replace(/ώ=/g, "ῴ");
    car = car.replace(/ὼ=/g, "ῲ");
    car = car.replace(/ω&/g, "ῶ");
    car = car.replace(/-ω/g, "ὡ");
    car = car.replace(/-ὡ/g, "ὠ");
    car = car.replace(/ῳ&/g, "ῷ");
    car = car.replace(/-ῳ/g, "ᾡ");
    car = car.replace(/-ᾡ/g, "ᾠ");
    car = car.replace(/ï/g, "ϊ");
    car = car.replace(/ï&/g, "ῗ");
    car = car.replace(/ϊ'/g, "ΐ");
    car = car.replace(/ΐ'/g, "ῒ");
    car = car.replace(/ῒ'/g, "ϊ");
    car = car.replace(/ü/g, "ϋ");
    car = car.replace(/ϋ&/g, "ῧ");
    car = car.replace(/ϋ'/g, "ΰ");
    car = car.replace(/ΰ'/g, "ῢ");
    car = car.replace(/ῢ'/g, "ϋ");
    car = car.replace(/ἀ'/g, "ἄ");
    car = car.replace(/ἄ'/g, "ἂ");
    car = car.replace(/ἂ'/g, "ἀ");
    car = car.replace(/ἁ'/g, "ἅ");
    car = car.replace(/ἅ'/g, "ἃ");
    car = car.replace(/ἃ'/g, "ἁ");
    car = car.replace(/ᾀ'/g, "ᾄ");
    car = car.replace(/ᾄ'/g, "ᾂ");
    car = car.replace(/ᾂ'/g, "ᾀ");
    car = car.replace(/ᾁ'/g, "ᾅ");
    car = car.replace(/ᾅ'/g, "ᾃ");
    car = car.replace(/ᾃ'/g, "ᾁ");
    car = car.replace(/ἐ'/g, "ἔ");
    car = car.replace(/ἔ'/g, "ἒ");
    car = car.replace(/ἒ'/g, "ἐ");
    car = car.replace(/ἑ'/g, "ἕ");
    car = car.replace(/ἕ'/g, "ἓ");
    car = car.replace(/ἓ'/g, "ἑ");
    car = car.replace(/ἠ'/g, "ἤ");
    car = car.replace(/ἤ'/g, "ἢ");
    car = car.replace(/ἢ'/g, "ἠ");
    car = car.replace(/ἡ'/g, "ἥ");
    car = car.replace(/ἥ'/g, "ἣ");
    car = car.replace(/ἣ'/g, "ἡ");
    car = car.replace(/ᾐ'/g, "ᾔ");
    car = car.replace(/ᾔ'/g, "ᾒ");
    car = car.replace(/ᾒ'/g, "ᾐ");
    car = car.replace(/ᾑ'/g, "ᾓ");
    car = car.replace(/ᾓ'/g, "ᾕ");
    car = car.replace(/ᾕ'/g, "ᾑ");
    car = car.replace(/ἰ'/g, "ἴ");
    car = car.replace(/ἴ'/g, "ἲ");
    car = car.replace(/ἲ'/g, "ἰ");
    car = car.replace(/ἱ'/g, "ἵ");
    car = car.replace(/ἵ'/g, "ἳ");
    car = car.replace(/ἳ'/g, "ἱ");
    car = car.replace(/ὀ'/g, "ὄ");
    car = car.replace(/ὄ'/g, "ὂ");
    car = car.replace(/ὂ'/g, "ὀ");
    car = car.replace(/ὁ'/g, "ὅ");
    car = car.replace(/ὅ'/g, "ὃ");
    car = car.replace(/ὃ'/g, "ὁ");
    car = car.replace(/ὐ'/g, "ὔ");
    car = car.replace(/ὔ'/g, "ὒ");
    car = car.replace(/ὒ'/g, "ὐ");
    car = car.replace(/ὑ'/g, "ὕ");
    car = car.replace(/ὕ'/g, "ὓ");
    car = car.replace(/ὓ'/g, "ὑ");
    car = car.replace(/ὠ'/g, "ὤ");
    car = car.replace(/ὤ'/g, "ὢ");
    car = car.replace(/ὢ'/g, "ὠ");
    car = car.replace(/ὡ'/g, "ὥ");
    car = car.replace(/ὥ'/g, "ὣ");
    car = car.replace(/ὣ'/g, "ὡ");
    car = car.replace(/ᾠ'/g, "ᾤ");
    car = car.replace(/ᾤ'/g, "ᾢ");
    car = car.replace(/ᾢ'/g, "ᾠ");
    car = car.replace(/ᾡ'/g, "ᾥ");
    car = car.replace(/ᾥ'/g, "ᾣ");
    car = car.replace(/ᾣ'/g, "ᾡ");
    car = car.replace(/ἀ&/g, "ἆ");
    car = car.replace(/ἁ&/g, "ἇ");
    car = car.replace(/ᾀ&/g, "ᾆ");
    car = car.replace(/ᾁ&/g, "ᾇ");
    car = car.replace(/ἠ&/g, "ἦ");
    car = car.replace(/ἡ&/g, "ἧ");
    car = car.replace(/ᾐ&/g, "ᾖ");
    car = car.replace(/ᾑ&/g, "ᾗ");
    car = car.replace(/ἰ&/g, "ἶ");
    car = car.replace(/ἱ&/g, "ἷ");
    car = car.replace(/ὐ&/g, "ὖ");
    car = car.replace(/ὑ&/g, "ὗ");
    car = car.replace(/ὠ&/g, "ὦ");
    car = car.replace(/ὡ&/g, "ὧ");
    car = car.replace(/ᾠ&/g, "ᾦ");
    car = car.replace(/ᾡ&/g, "ᾧ");
    car = car.replace(/ἀ=/g, "ᾀ");
    car = car.replace(/ἁ=/g, "ᾁ");
    car = car.replace(/ἂ=/g, "ᾂ");
    car = car.replace(/ἃ=/g, "ᾃ");
    car = car.replace(/ἄ=/g, "ᾄ");
    car = car.replace(/ἅ=/g, "ᾅ");
    car = car.replace(/ἆ=/g, "ᾆ");
    car = car.replace(/ἇ=/g, "ᾇ");
    car = car.replace(/ᾶ=/g, "ᾷ");
    car = car.replace(/ἠ=/g, "ᾐ");
    car = car.replace(/ἡ=/g, "ᾑ");
    car = car.replace(/ἢ=/g, "ᾒ");
    car = car.replace(/ἣ=/g, "ᾓ");
    car = car.replace(/ἤ=/g, "ᾔ");
    car = car.replace(/ἥ=/g, "ᾕ");
    car = car.replace(/ἦ=/g, "ᾖ");
    car = car.replace(/ἧ=/g, "ᾗ");
    car = car.replace(/ῆ=/g, "ῇ");
    car = car.replace(/ὠ=/g, "ᾠ");
    car = car.replace(/ὡ=/g, "ᾡ");
    car = car.replace(/ὢ=/g, "ᾢ");
    car = car.replace(/ὣ=/g, "ᾣ");
    car = car.replace(/ὤ=/g, "ᾤ");
    car = car.replace(/ὥ=/g, "ᾥ");
    car = car.replace(/ὦ=/g, "ᾦ");
    car = car.replace(/ὧ=/g, "ᾧ");
    car = car.replace(/ῶ=/g, "ῷ");
    car = car.replace(/z/g, "ζ");
    car = car.replace(/v/g, "υ");
    car = car.replace(/y/g, "υ");
    car = car.replace(/τ-/g, "θ");
    car = car.replace(/πσ/g, "ψ");
    car = car.replace(/ç/g, "ς");
    car = car.replace(/q/g, "κ");
    car = car.replace(/J/g, "Η");
    car = car.replace(/H/g, "-");
    car = car.replace(/A/g, "Α");
    car = car.replace(/Α'/g, "Ά");
    car = car.replace(/Ά'/g, "Ὰ");
    car = car.replace(/Ὰ'/g, "Ᾰ");
    car = car.replace(/Ᾰ'/g, "Ᾱ");
    car = car.replace(/Ᾱ'/g, "Α");

    car = car.replace(/Â/g, "Ά");
    car = car.replace(/Ä/g, "Ά");
    car = car.replace(/À/g, "Ά");
    car = car.replace(/-Α/g, "Ἁ");
    car = car.replace(/-Ἁ/g, "Ἀ");
    car = car.replace(/B/g, "Β");
    car = car.replace(/C/g, "Κ");
    car = car.replace(/Κ-/g, "Χ");
    car = car.replace(/D/g, "Δ");
    car = car.replace(/E/g, "Ε");
    car = car.replace(/É/g, "Έ");
    car = car.replace(/Ε'/g, "Έ");
    car = car.replace(/Έ'/g, "Ὲ");
    car = car.replace(/Ὲ'/g, "Ε");
    car = car.replace(/-Ε/g, "Ἑ");
    car = car.replace(/-Ἑ/g, "Ἐ");
    car = car.replace(/F/g, "Φ");
    car = car.replace(/Π-/g, "Φ");
    car = car.replace(/G/g, "Γ");
    car = car.replace(/È/g, "Η");
    car = car.replace(/Ê/g, "Ή");
    car = car.replace(/Η'/g, "Ή");
    car = car.replace(/Ή'/g, "Ὴ");
    car = car.replace(/Ὴ'/g, "Η");
    car = car.replace(/-Η/g, "Ἡ");
    car = car.replace(/-Ἡ/g, "Ἠ");
    car = car.replace(/I/g, "Ι");
    car = car.replace(/Ι'/g, "Ί");
    car = car.replace(/Ί'/g, "Ὶ");
    car = car.replace(/Ὶ'/g, "Ῐ");
    car = car.replace(/Ῐ'/g, "Ῑ");
    car = car.replace(/Ῑ'/g, "Ι");

    car = car.replace(/Î/g, "Ί");
    car = car.replace(/-Ι/g, "Ἱ");
    car = car.replace(/-Ἱ/g, "Ἰ");
    car = car.replace(/X/g, "Ξ");
    car = car.replace(/K/g, "Κ");
    car = car.replace(/L/g, "Λ");
    car = car.replace(/M/g, "Μ");
    car = car.replace(/N/g, "Ν");
    car = car.replace(/O/g, "Ο");
    car = car.replace(/Ο'/g, "Ό");
    car = car.replace(/Ό'/g, "Ὸ");
    car = car.replace(/Ὸ'/g, "Ο");
    car = car.replace(/-Ο/g, "Ὁ");
    car = car.replace(/-Ὁ/g, "Ὀ");
    car = car.replace(/P/g, "Π");
    car = car.replace(/R/g, "Ρ");
    car = car.replace(/Ρ'/g, "Ῥ");
    car = car.replace(/S/g, "Σ");
    car = car.replace(/T/g, "Τ");
    car = car.replace(/U/g, "Υ");
    car = car.replace(/Ù/g, "Ύ");
    car = car.replace(/Û/g, "Ύ");
    car = car.replace(/Υ'/g, "Ύ");
    car = car.replace(/Ύ'/g, "Ὺ");
    car = car.replace(/Ὺ'/g, "Ῠ");
    car = car.replace(/Ῠ'/g, "Ῡ");
    car = car.replace(/Ῡ'/g, "Υ");

    car = car.replace(/-Υ/g, "Ὑ");
    car = car.replace(/W/g, "Ω");
    car = car.replace(/Ô/g, "Ω");
    car = car.replace(/Ω'/g, "Ώ");
    car = car.replace(/Ώ'/g, "Ὼ");
    car = car.replace(/Ὼ'/g, "Ω");
    car = car.replace(/-Ω/g, "Ὡ");
    car = car.replace(/-Ὡ/g, "Ὠ");
    car = car.replace(/Ἀ'/g, "Ἄ");
    car = car.replace(/Ἄ'/g, "Ἂ");
    car = car.replace(/Ἂ'/g, "Ἀ");
    car = car.replace(/Ἁ'/g, "Ἅ");
    car = car.replace(/Ἅ'/g, "Ἃ");
    car = car.replace(/Ἃ'/g, "Ἁ");
    car = car.replace(/Ἐ'/g, "Ἔ");
    car = car.replace(/Ἔ'/g, "Ἒ");
    car = car.replace(/Ἒ'/g, "Ἐ");
    car = car.replace(/Ἑ'/g, "Ἕ");
    car = car.replace(/Ἕ'/g, "Ἓ");
    car = car.replace(/Ἓ'/g, "Ἑ");
    car = car.replace(/Ἠ'/g, "Ἤ");
    car = car.replace(/Ἤ'/g, "Ἢ");
    car = car.replace(/Ἢ'/g, "Ἠ");
    car = car.replace(/Ἡ'/g, "Ἥ");
    car = car.replace(/Ἥ'/g, "Ἣ");
    car = car.replace(/Ἣ'/g, "Ἡ");
    car = car.replace(/Ἰ'/g, "Ἴ");
    car = car.replace(/Ἴ'/g, "Ἲ");
    car = car.replace(/Ἲ'/g, "Ἰ");
    car = car.replace(/Ἱ'/g, "Ἵ");
    car = car.replace(/Ἵ'/g, "Ἳ");
    car = car.replace(/Ἳ'/g, "Ἱ");
    car = car.replace(/Ὀ'/g, "Ὄ");
    car = car.replace(/Ὄ'/g, "Ὂ");
    car = car.replace(/Ὂ'/g, "Ὀ");
    car = car.replace(/Ὁ'/g, "Ὅ");
    car = car.replace(/Ὅ'/g, "Ὃ");
    car = car.replace(/Ὃ'/g, "Ὁ");
    car = car.replace(/Ὑ'/g, "Ὕ");
    car = car.replace(/Ὕ'/g, "Ὓ");
    car = car.replace(/Ὓ'/g, "Ὑ");
    car = car.replace(/Ὠ'/g, "Ὤ");
    car = car.replace(/Ὤ'/g, "Ὢ");
    car = car.replace(/Ὢ'/g, "Ὠ");
    car = car.replace(/Ὡ'/g, "Ὥ");
    car = car.replace(/Ὥ'/g, "Ὣ");
    car = car.replace(/Ὣ'/g, "Ὡ");
    car = car.replace(/Ἀ&/g, "Ἆ");
    car = car.replace(/Ἁ&/g, "Ἇ");
    car = car.replace(/Ἠ&/g, "Ἦ");
    car = car.replace(/Ἡ&/g, "Ἧ");
    car = car.replace(/Ἰ&/g, "Ἶ");
    car = car.replace(/Ἱ&/g, "Ἷ");
    car = car.replace(/Ὑ&/g, "Ὗ");
    car = car.replace(/Ὠ&/g, "Ὦ");
    car = car.replace(/Ὡ&/g, "Ὧ");
    car = car.replace(/Z/g, "Ζ");
    car = car.replace(/V/g, "Υ");
    car = car.replace(/Y/g, "Υ");
    car = car.replace(/Τ-/g, "Θ");
    car = car.replace(/ΠΣ/g, "Ψ");
    car = car.replace(/Q/g, "Κ");
    car = car.replace(/Α=/g, "ᾼ");
    car = car.replace(/Η=/g, "ῌ");
    car = car.replace(/Ω=/g, "ῼ");
    car = car.replace(/ᾈ'/g, "ᾌ");
    car = car.replace(/ᾌ'/g, "ᾊ");
    car = car.replace(/ᾊ'/g, "ᾈ");
    car = car.replace(/ᾉ'/g, "ᾍ");
    car = car.replace(/ᾍ'/g, "ᾋ");
    car = car.replace(/ᾋ'/g, "ᾉ");
    car = car.replace(/ᾘ'/g, "ᾜ");
    car = car.replace(/ᾜ'/g, "ᾚ");
    car = car.replace(/ᾚ'/g, "ᾘ");
    car = car.replace(/ᾙ'/g, "ᾛ");
    car = car.replace(/ᾛ'/g, "ᾝ");
    car = car.replace(/ᾝ'/g, "ᾙ");
    car = car.replace(/ᾨ'/g, "ᾬ");
    car = car.replace(/ᾬ'/g, "ᾪ");
    car = car.replace(/ᾪ'/g, "ᾨ");
    car = car.replace(/ᾩ'/g, "ᾭ");
    car = car.replace(/ᾭ'/g, "ᾫ");
    car = car.replace(/ᾫ'/g, "ᾩ");
    car = car.replace(/Ἀ=/g, "ᾈ");
    car = car.replace(/Ἁ=/g, "ᾉ");
    car = car.replace(/Ἂ=/g, "ᾊ");
    car = car.replace(/Ἃ=/g, "ᾋ");
    car = car.replace(/Ἄ=/g, "ᾌ");
    car = car.replace(/Ἅ=/g, "ᾍ");
    car = car.replace(/Ἆ=/g, "ᾎ");
    car = car.replace(/Ἇ=/g, "ᾏ");
    car = car.replace(/Ἠ=/g, "ᾘ");
    car = car.replace(/Ἡ=/g, "ᾙ");
    car = car.replace(/Ἢ=/g, "ᾚ");
    car = car.replace(/Ἣ=/g, "ᾛ");
    car = car.replace(/Ἤ=/g, "ᾜ");
    car = car.replace(/Ἥ=/g, "ᾝ");
    car = car.replace(/Ἦ=/g, "ᾞ");
    car = car.replace(/Ἧ=/g, "ᾟ");
    car = car.replace(/Ὠ=/g, "ᾨ");
    car = car.replace(/Ὡ=/g, "ᾩ");
    car = car.replace(/Ὢ=/g, "ᾪ");
    car = car.replace(/Ὣ=/g, "ᾫ");
    car = car.replace(/Ὤ=/g, "ᾬ");
    car = car.replace(/Ὥ=/g, "ᾭ");
    car = car.replace(/Ὦ=/g, "ᾮ");
    car = car.replace(/Ὧ=/g, "ᾯ");
    car = car.replace(/σ /g, "ς ");
    car = car.replace(/σ,/g, "ς,");
    car = car.replace(/σ;/g, "ς;");
    car = car.replace(/σ:/g, "ς:");
    car = car.replace(/σ!/g, "ς!");
    car = car.replace(/σ\./g, "ς\.");
    car = car.replace(/\?/g, "\;");
    MK_KEYBOARD.$currentTextElement.val(car);
};


MK_KEYBOARD.translateChar2HEBREW = function () {
    var car = MK_KEYBOARD.$currentTextElement.val();
    car = car.replace(/’/g, "\'");
    car = car.replace(/a/g, "א");
    car = car.replace(/b/g, "ב");
    car = car.replace(/ב'/g, "בּ");
    car = car.replace(/g/g, "ג");
    car = car.replace(/d/g, "ד");
    car = car.replace(/h/g, "ה");
    car = car.replace(/[uov]/g, "ו");
    car = car.replace(/z/g, "ז");
    car = car.replace(/H/g, "ח");
    car = car.replace(/[iyeéèê]/g, "י");
    car = car.replace(/k/g, "כ");
    car = car.replace(/כ'/g, "כּ");
    car = car.replace(/כ /g, "ך ");
    car = car.replace(/K/g, "ך");
    car = car.replace(/l/g, "ל");
    car = car.replace(/m/g, "מ");
    car = car.replace(/M/g, "ם");
    car = car.replace(/מ /g, "ם ");
    car = car.replace(/n/g, "נ");
    car = car.replace(/נ /g, "ן ");
    car = car.replace(/N/g, "ן");
    car = car.replace(/s/g, "ס");
    car = car.replace(/-/g, "ע");
    car = car.replace(/f/g, "פ");
    car = car.replace(/פ'/g, "פּ");
    car = car.replace(/p/g, "פּ");
    car = car.replace(/פ /g, "ף ");
    car = car.replace(/F/g, "ף");
    car = car.replace(/q/g, "ק");
    car = car.replace(/r/g, "ר");
    car = car.replace(/S/g, "צ");
    car = car.replace(/צ /g, "ץ ");
    car = car.replace(/[cç]/g, "ש");
    car = car.replace(/ש'/g, "שׁ");
    car = car.replace(/שׁ'/g, "שׂ");
    car = car.replace(/T/g, "ט");
    car = car.replace(/t/g, "ת");
    MK_KEYBOARD.$currentTextElement.val(car);
};
