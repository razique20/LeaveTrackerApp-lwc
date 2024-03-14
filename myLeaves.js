
import { refreshApex } from '@salesforce/apex';
import getMyLeaves from '@salesforce/apex/LeaveRequstController.getMyLeaves';
import Id from '@salesforce/user/Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { LightningElement, wire } from 'lwc';

const COLUMNS =  [
    {label:'Request Id', fieldName: 'Name',cellAttributes: { class: {fieldName:'cellclass'}}},
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

export default class MyLeaves extends LightningElement {
    columns = COLUMNS;

    myLeave=[];
    myLeavesWireResult;
    showModalPopup=false;
    objectApiName='LeaveRequest__c';
    recordId='';
    currentUserId = Id;

    @wire(getMyLeaves)
    wiredMyLeaves(result){
        this.myLeaveResult = result;
        if(result.data){
            this.myLeaves=result.data.map(a=> ({
            ...a,
            cellclass: a.status__c == 'Approved' ? 'slds-theme_success' :a.status__c == 'Rejected'?'slds-theme_warning':'',
            isEditDisabled:a.Status__c!='Pending'
            }));
        }
        if(result.error){
            console.log('Error occured while fetching My Leaves',result.error)
        }
    }
    get noRecordsFound(){
    
        return this.myLeaves.length == 0;
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
        refreshApex(this.myLeavesWireResult);

        const refreshEvent = new CustomEvent('refreshleaverequests');
        this.dispatchEvent(refreshEvent);
    }

    submitHandler(event){
        event.preventDefault();
        const fields = { ...event.detail.fields};
        fields.Status__c='Pending';
        if(new Date(fields.From_Date__c)>new Date(fields.To_Date__c)){
            this.showToast('From date should not be greater than to date','Error','error');

        }
        else if(new Date() > new Date(fields.From_Date__c)){
            this.showToast('From date should not be less than today','Error','error');
        }
        else{
            this.refs.leaveRequestFrom.submit(fields);
        }
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