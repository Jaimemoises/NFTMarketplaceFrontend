import { FormControl, ValidationErrors } from "@angular/forms";

export class NftMarketPlaceValidators {

    //white space validation

    static notOnlyWhiteSpace(control: FormControl) : ValidationErrors{
        
        //check if string onoly contains whitespace
        if ((control.value != null) && (control.value.trim().length === 0)){

            //invalid, return error object
            return { 'notOnlyWhiteSpace': true };
        }
        else{
            //valid return null
            return null;
        }
    }
}
