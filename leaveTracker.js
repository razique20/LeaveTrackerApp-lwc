import { LightningElement } from 'lwc';

export default class LeaveTracker extends LightningElement {
    refreshLeaveReqeuestHandler(event){
        this.refreshLeaveReqeuestHandler.myLeavesComp.refreshGrid();
    }
}