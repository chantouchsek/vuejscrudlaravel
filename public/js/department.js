/**
 * Created by Chantouch on 3/3/2017.
 */
Vue.http.headers.common['X-CSRF-TOKEN'] = $("#token").attr("content");

const business = new Vue({
    el: '#departments',
    data(){
        return {
            prop: {
                pagination: {
                    type: Object,
                    required: true
                },
                offset: {
                    type: Number,
                    default: 4
                }
            },
            pagination: {},
            offset: 4,
            newItem: {
                'name': '',
                'description': '',
                'status': '',
            },
            fillItem: {
                'name': '',
                'description': '',
                'status': '',
                'id': ''
            },
            items: [],
            formErrors: {},
            formErrorsUpdate: {},
            columns: {},
            query: {
                page: 1,
                column: 'id',
                direction: 'desc',
                per_page: 15,
                search_column: 'id',
                search_operator: 'equal',
                search_input: ''
            },
            operators: {
                equal: '=',
                not_equal: '<>',
                less_than: '<',
                greater_than: '>',
                less_than_or_equal_to: '<=',
                greater_than_or_equal_to: '>=',
                in: 'IN',
                like: 'LIKE'
            }
        }
    },
    computed: {
        isActive(){
            return this.pagination.current_page;
        },
        pagesNumber(){
            if (!this.pagination.to) {
                return [];
            }
            let from = this.pagination.current_page - this.offset;
            if (from < 1) {
                from = 1;
            }
            let to = from + (this.offset * 2);
            if (to > this.pagination.last_page) {
                to = this.pagination.last_page;
            }
            let pagesArray = [];
            for (from = 1; from <= to; from++) {
                pagesArray.push(from);
            }
            return pagesArray;
        }
    },
    created(){
        this.fetchItems(this.pagination.current_page);
    },
    methods: {

        fetchItems (page)//get all item from server.
        {
            this.$http.get('/api/departments?page=' + page).then((response) => {
                this.items = response.data;
                this.pagination = response.data;
            });
        },

        createItem(){//create new item.
            let input = this.newItem;
            this.$http.post('/api/departments', input).then((response) => {
                this.changePage(this.pagination.current_page);
                this.newItem = {
                    'name': '',
                    'description': '',
                    'status': ''
                };
                $('#create-item').modal('hide');
                // toastr.success("Item created success fully!", 'Success Alert', {timeOut: 5000});
            }, (response) => {
                this.formErrors = response.data;
            })
        },
        //for show the form of edit.
        editItem(item){
            let fill = this.fillItem;
            fill.name = item.name;
            fill.description = item.description;
            fill.status = item.status;
            fill.id = item.id;
            $("#edit-item").modal('show');
        },

        //to update the data that is already showed.
        updateItem(id){
            let input = this.fillItem;
            this.$http.patch('/api/departments/' + id, input).then((response) => {
                this.changePage(this.pagination.current_page);
                this.newItem = {//set all input to empty.
                    'name': '',
                    'description': '',
                    'status': '',
                    'id': ''
                };
                $("#edit-item").modal('hide');//then hide the form from popup.
                // toastr.success('Item successfully updated.', 'Success Alert', {timeOut: 5000});
            }, (response) => {
                this.formErrors = response.data;
            })
        },

        deleteItem(item){
            let con = confirm("Are you sure to do that?");//ask to confirm the user to sure that want to delete this item?
            if (con) {
                this.$http.delete('/api/departments/' + item.id).then((response) => {
                    this.changePage(this.pagination.current_page);
                    // toastr.success("Item deleted successfully.", "Success Alert", {timeOut: 5000});
                });
            }
        },

        changePage(page){//change to pagination.
            this.pagination.current_page = page;
            this.fetchItems(page)
        }
    }
});