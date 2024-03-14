
import { refreshApex } from '@salesforce/apex';
import getLeaveRequests from '@salesforce/apex/LeaveRequstController.getLeaveRequests';
import Id from '@salesforce/user/Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { LightningElement, api, wire } from 'lwc';

const COLUMNS =  [
    {label:'Request Id', fieldName: 'Name',cellAttributes: { class: {fieldName:'cellclass'}}},
    {label:'User', fieldName: 'userName',cellAttributes: { class: {fieldName:'cellclass'}}},
    {label:'From Date', fieldName: 'From_Date__c',cellAttributes: { class: {fieldName:'cellclass'}}},
    {label:'To Date', fieldName: 'To_Date__c',cellAttributes: { class: {fieldName:'cellclass'}}},
    {label:'Reason', fieldName: 'Reason__c',cellAttributes: { class: {fieldName:'cellclass'}}},
    {label:'Status', fieldName: 'Status_c',cellAttributes: { class: {fieldName:'cellclass'}}},
    {label:'Manager Comment', fieldName: 'Manager_Comment__c',cellAttributes: { class: {fieldName:'cellclass'}}},
    {type:"button",typeAttributes:{
        label:'Edit',
        name:'Edit',
        title:'Edit',
        value:'edit',
        disabled:{ fieldName: 'isEditDisabled'}
    },cellAttributes: { class: {fieldName:'cellclass'}}
}
]

export default class leaveRequests extends LightningElement {
    columns = COLUMNS;

    LeavesRequests=[];
    LeavesRequestsWireResult;
    showModalPopup=false;
    objectApiName='LeaveRequest__c';
    recordId='';
    currentUserId = Id;

    @wire(getLeaveRequests)
    wiredMyLeaves(result){
        this.LeavesRequestsWireResult = result;
        if(result.data){
            this.LeavesRequests=result.data.map(a=> ({
            ...a,
            userName:a.User__r.Name,
            cellclass: a.status__c == 'Approved' ? 'slds-theme_success' :a.status__c == 'Rejected'?'slds-theme_warning':'',
            isEditDisabled:a.Status__c!='Pending'
            }));
        }
        if(result.error){
            console.log('Error occured while fetching My Leaves',result.error)
        }
    }
    get noRecordsFound(){
    
        return this.LeavesRequests.length == 0;
    }

    newRequestClickHandler(){
        this.showModalPopup = true;
        this.recordId = '';
    }

    popupCloseHandler(){
        this.showModalPopup = false;
    }

    rowActionHandler(event){
        this.showModalPopup=true;
        this.recordId=event.detail.row.Id;

    }

    successHandler(event){
        this.showModalPopup = false;
        this.showToast('Data Saved Succesfully');
        this.refreshGrid();
        
    }
    @api
    refreshGrid() {
        refreshApex(this.LeavesRequestsWireResult);
    }

    
    showToast(message,title='success',variant='success'){
        const event = new ShowToastEvent({
            title,
            message,
            variant
        })
        this.dispatchEvent(event);
    }
}