import { observable, action, runInAction } from 'mobx';
export default class DetailStore {
    @observable
    count = 1;

    @observable
    data = { a: 'xixixi' };

    @action('加')
    add() {
        console.log(
            '%c 🍷 this.count: ',
            'font-size:20px;background-color: #6EC1C2;color:#fff;',
            this.count
        );

        this.count = this.count + 1;
        this.data = { a: 'hahaha' };
        console.log(
            '%c 🥥 this.data: ',
            'font-size:20px;background-color: #E41A6A;color:#fff;',
            this.data
        );
    }
}
