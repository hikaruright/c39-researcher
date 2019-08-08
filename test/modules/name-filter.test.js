const expect = require('expect');
const NameCondition = require('../../modules/name-filter')

describe('フィルタテスト', () => {
    describe('getPlace', () => {
        describe('館情報取得', () => {

            const conditiion = new NameCondition('https://twitter.com/katomayumi', '加藤マユミ@3日目西R-42')
            conditiion.getPlace()
            expect(conditiion.booth.place).toBe('西')
        })
    
        describe('複数の方位情報', () => {
            const conditiion = new NameCondition('https://twitter.com/katomayumi', '東野明美@3日目西R-32')
            conditiion.getPlace()
            expect(conditiion.booth.place).toBe('西')
        })
    })

    describe('splitNameIfNeeded', () => {
        describe('小文字変換', () => {
            const conditiion = new NameCondition('https://twitter.com/katomayumi', '加藤マユミ@3日目西R-42')
            
            expect(conditiion.splitNameIfNeeded('東野明美@3日目西R-32')).toBe('3日目西R-32')
        })

        describe('２バイト変換', () => {
            const conditiion = new NameCondition('https://twitter.com/katomayumi', '加藤マユミ@3日目西R-42')
            
            expect(conditiion.splitNameIfNeeded('加藤清史郎＠３日目東R-41')).toBe('３日目東R-41')
        })

        describe('分割文字なし', () => {
            const conditiion = new NameCondition('https://twitter.com/vitaone_', 'ビタワン 🐕夏コミ3日目 西4ホール A-30a')
            
            expect(conditiion.splitNameIfNeeded('ビタワン 🐕夏コミ3日目 西4ホール A-30a')).toBe('ビタワン 🐕夏コミ3日目 西4ホール A-30a')
        })
    })

    describe('getDay', () => {

        describe('X日目(single)', () => {
            const conditiion = new NameCondition('https://twitter.com/vitaone_', '加藤清史郎＠2日目東R-41')
            expect(conditiion.getDay()).toBe('2')
        })

        describe('X日目(multi)', () => {
            const conditiion = new NameCondition('https://twitter.com/vitaone_', '加藤清史郎＠３日目東R-41')
            expect(conditiion.getDay()).toBe('3')
        })

        describe('丸数字', () => {
            const conditiion = new NameCondition('https://twitter.com/vitaone_', '加藤清史郎＠②東R-41')
            expect(conditiion.getDay()).toBe('2')
        })

        describe('曜日', () => {
            const conditiion = new NameCondition('https://twitter.com/itoww', 'いとーのいぢc96月曜日/西“れ”50a')
            expect(conditiion.getDay()).toBe('4')
        })
    })

    describe('getHole', () => {

        describe('あるパターン', () => {
            const conditiion = new NameCondition('https://twitter.com/vitaone_', 'ビタワン 🐕夏コミ3日目 西4ホール A-30a')
            expect(conditiion.getHole()).toBe('4ホール')
        })

        describe('ないパターン', () => {
            const conditiion = new NameCondition('https://twitter.com/vitaone_', '加藤清史郎＠３日目東R-41')
            expect(conditiion.getHole()).toBe(null)
        })
    })

    describe('getBoothNo', () => {
        
        describe('パターン1', () => {
            const conditiion = new NameCondition('https://twitter.com/vitaone_', 'ビタワン 🐕夏コミ3日目 西4ホール A-30a')
            expect(conditiion.getBoothNo()).toBe('A-30a')
        })

        describe('パターン2', () => {
            const conditiion = new NameCondition('https://twitter.com/vitaone_', '加藤清史郎＠３日目東R-41')
            expect(conditiion.getBoothNo()).toBe('R-41')           
        })

        describe('パターン３', () => {
            const conditioin = new NameCondition('', 'いとーのいぢc96月曜日/西“れ”50a')
            expect(conditioin.getBoothNo()).toBe('れ50a')

        })

        describe('パターン４', () => {
            const conditiion = new NameCondition('https://twitter.com/yuukikagou', 'さとうユーキ＠夏４日目南フ06b＠連載中')
            expect(conditiion.getBoothNo()).toBe('フ06b')
        })
    })

    describe('統合テスト', () => {

        describe('テスト１', () => {
            const conditiion = new NameCondition('https://twitter.com/vitaone_', 'ビタワン 🐕夏コミ3日目 西4ホール A-30a')

            expect(conditiion.booth).toEqual({
                url: 'https://twitter.com/vitaone_',
                name: 'ビタワン 🐕夏コミ3日目 西4ホール A-30a',
                day: '3',
                place: '西',
                hole: '4ホール',
                position: 'A-30a'
            });
        })

        describe('テスト2', () => {
            const conditiion = new NameCondition('https://twitter.com/yuukikagou', 'さとうユーキ＠夏４日目南フ06b＠連載中')

            console.log(conditiion.booth)

            expect(conditiion.booth).toEqual({
                url: 'https://twitter.com/yuukikagou',
                name: 'さとうユーキ＠夏４日目南フ06b＠連載中',
                day: '4',
                place: '南',
                hole: null,
                position: 'フ06b'
            })

        })
    })
})