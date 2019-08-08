'use strict';

var Booth = require ('../entity/booth');

/**
 * ブースに関するコンディション情報
 * @properties
 *   @proporty booth ブース情報
 */
class NameCondition {

    /**
     * 
     * @param {String} url TwitterURL
     * @param {String} username ユーザの名前
     */
    constructor (url, username) {
        this.url = url;
        this.username = username;
        this.boothinfo = this.splitNameIfNeeded(username);
        this.booth = new Booth(url, username);

        this.booth.url = this.url;
        this.booth.name = this.username;
        this.getPlace()
        this.getDay()
        this.getHole()
        this.getBoothNo()
    }

    /**
     * 名前に@があれば@より前を抽出
     * @param {string} name 
     */
    splitNameIfNeeded(name) {
        // 半
        var splitted = name.split('@');
        // 全
        if(splitted.length === 1) {
            splitted = name.split('＠');
        } 
        if (splitted.length !== 2) {
            return name;
        }
        return splitted[splitted.length-1];
    }

    /**
     * 館情報を取得
     */
    getPlace () {
        const pattern = /東|西|南|青|青海/gu;
        var result = this.boothinfo.match(pattern);

        if (result) {
            this.booth.place = result[result.length-1];
        } 

        return this.booth.place;
    }

    /**
     * 日付情報を取得
     */
    getDay () {
        // console.log(this.boothinfo);

        const pattern = /(([1-4]|[１-４])(日目))|①|②|③/gu;
        var result = this.boothinfo.match(pattern);

        // console.log(result);

        if (!result) {
            this.booth.day = this.getDayByWeek();
            return this.booth.day;
        }

        var str = result[0];

        // ~日目を除去
        str = str.replace('日目','');
        // console.log("str > " + str);

        // multibyte -> singlebyte
        const map = {
            "１":"1", 
            "①":"1",
            "２":"2", 
            "②":"2",
            "３":"3", 
            "③":"3",
            "４":"4", 
            "④":"4"
        };

        str = this.replaceString(str, map);

        // console.log('replaced > ' + str);

        this.booth.day = str;

        return this.booth.day;
    }

    getDayByWeek() {
        const pattern = /(金|土|日|月)([曜日]*)/gu;
        var result = this.boothinfo.match(pattern);

        if (!result) return null;

        console.log(result);

        if      (result[0].indexOf('金') == 0) return '1';
        else if (result[0].indexOf('土') == 0) return '2';
        else if (result[0].indexOf('日') == 0) return '3';
        else if (result[0].indexOf('月') == 0) return '4';

        return null;
    }

    /**
     * 文字列置換
     * @param {string} str 対象文字列
     * @param {map} map 変換マップ
     */
    replaceString (str, map) {

        Object.keys(map).forEach((key) => {
            str = str.replace(key, map[key]);
        });
        return str;
    }

    /**
     * ホール情報を取得
     */
    getHole () {
        const pattern = /([1-9]|[１-９])(ホール)/gu;
        var result = this.boothinfo.match(pattern);

        if (result) {
            this.booth.hole = result[result.length-1];
        } else {
            this.booth.hole = null;
        }

        return this.booth.hole;
    }

    /**
     * ブースの場所情報
     */
    getBoothNo () {
        const pattern = /([a-zA-Z]|[あ-わ]|[ア-ン])([-]*)([0-9]+)([あーわ]*)([A-Za-z]*)/gu;

        // ==============
        // 外れ値を除外する
        // ==============

        // 不要なクオートを削除
        var before = this.replaceString(this.boothinfo, {
            '"': '',
            '“': '',
            '”': ''
        });

        // "C96"を除外
        before = this.replaceString(before, {
            'c96': '',
            'C96': '',
            'C96': ''
        });

        before = this.replaceString(before, {
            '夏コミ': '',
            '夏ｺﾐ': ''
        });

        console.log('before >>> ' + before);

        var result = before.match(pattern);

        console.log(result);

        if (result) {
            this.booth.position = result[0];
        } else {
            this.booth.position = null;
        }

        return this.booth.position;
    }
}

module.exports = NameCondition;