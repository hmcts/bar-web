// tslint:disable:no-trailing-whitespace
// tslint:disable:max-line-length
export const feelogDetailCompHtml =
`<!--bindings={
  "ng-reflect-ng-if": "true"
}--><h1 _ngcontent-c7="" class="heading-xlarge">Edit case and fee details</h1>
  <!--bindings={
  "ng-reflect-ng-if": "false"
}-->
  <div _ngcontent-c7="">
    <form _ngcontent-c7="" novalidate="" class="ng-untouched ng-pristine ng-invalid">
      <div _ngcontent-c7="" class="form-group section" style="margin-bottom: 10px" hidden="">
        <div _ngcontent-c7="" class="multiple-choice">
          <input _ngcontent-c7="" id="prev-case" name="prev-case" type="checkbox" ng-reflect-name="prev-case" ng-reflect-model="false" class="ng-untouched ng-pristine ng-valid">
          <label _ngcontent-c7="" for="prev-case">Same as previous case</label>
        </div>
      </div>
      <div _ngcontent-c7="" class="form-group" id="caseInputSection" ng-reflect-klass="form-group" ng-reflect-ng-class="[object Object]">
        <label _ngcontent-c7="" class="form-label" for="case-reference">
          <span _ngcontent-c7="" class="heading-small">Case number</span>
          <span _ngcontent-c7="" class="error-message">Enter case number</span>
        </label>
        <input _ngcontent-c7="" class="form-control short-input ng-untouched ng-pristine ng-invalid" id="case-reference" name="case-reference" required="" type="text" ng-reflect-required="" ng-reflect-name="case-reference" ng-reflect-model="ccc111">
      </div>
      <div _ngcontent-c7="" class="form-group" id="caseSelectSection" ng-reflect-klass="form-group" ng-reflect-ng-class="[object Object]" hidden="">
          <label _ngcontent-c7="" class="form-label" for="case-reference-selector">
            <span _ngcontent-c7="" class="heading-small">Case number</span>
            <span _ngcontent-c7="" class="error-message">Enter case number</span>
          </label>
        <select _ngcontent-c7="" class="form-control short-input ng-untouched ng-pristine ng-invalid" id="case-reference-selector" name="case-reference-selector" required="" ng-reflect-required="" ng-reflect-name="case-reference-selector" ng-reflect-model="ccc111">
          <!--bindings={
  "ng-reflect-ng-for-of": "ccc111"
}--><option _ngcontent-c7="" value="ccc111" ng-reflect-value="ccc111">ccc111</option>
        </select>
      </div>
      <div _ngcontent-c7="" class="form-group" id="feeSelectorSection" ng-reflect-klass="form-group" ng-reflect-ng-class="[object Object]">
        <label _ngcontent-c7="" class="form-label" for="feeSearch">
          <span _ngcontent-c7="" class="heading-small">Search for a Fee</span>
          <span _ngcontent-c7="" class="form-hint">
            You don't need to use the whole fee code or description, e.g CH43, Appeal
          </span>
          <span _ngcontent-c7="" class="error-message">Select a fee</span>
        </label>
        <div _ngcontent-c7="" class="search-fees__form">
          <input _ngcontent-c7="" class="form-control long-input ng-untouched ng-pristine ng-valid" id="feeSearch" name="feeSearch" placeholder="" type="text" ng-reflect-name="feeSearch" ng-reflect-model="">
        </div>
      </div>
      <div _ngcontent-c7="" class="fee-search" hidden="">
        <table _ngcontent-c7="">
          <thead _ngcontent-c7="">
            <tr _ngcontent-c7="">
              <th _ngcontent-c7="">Code</th>
              <th _ngcontent-c7="">Description</th>
              <th _ngcontent-c7="">Amount</th>
              <th _ngcontent-c7=""></th>
            </tr>
          </thead>
          <tbody _ngcontent-c7="">
            <!--bindings={
  "ng-reflect-ng-for-of": ""
}-->
          </tbody>
        </table>
      </div>
      <div _ngcontent-c7="" class="current-fee">
        <div _ngcontent-c7="" class="header">
          <div _ngcontent-c7="" class="column">
            Fee details
          </div>
          <div _ngcontent-c7="" class="column" style="text-align: right;">
            <a _ngcontent-c7="" hidden="">Edit</a>
          </div>
        </div>
        <div _ngcontent-c7="" class="row">
            <div _ngcontent-c7="" class="column" style="width: 20%">
              Code:
            </div>
            <div _ngcontent-c7="" class="column">
              X0033
            </div>
          </div>
        <div _ngcontent-c7="" class="row">
          <div _ngcontent-c7="" class="column" style="width: 20%">
            Description:
          </div>
          <div _ngcontent-c7="" class="column">
            Recovery of Land - High Court
          </div>
        </div>
        <div _ngcontent-c7="" class="row">
          <div _ngcontent-c7="" class="column" style="width: 20%">
            Amount:
          </div>
          <span _ngcontent-c7="" class="column">
            £480.00
          </span>
        </div>
      </div>
      <div _ngcontent-c7="" class="form-group section" style="margin-bottom: 10px">
        <div _ngcontent-c7="" class="multiple-choice">
          <input _ngcontent-c7="" id="remission" name="remission" type="checkbox" ng-reflect-name="remission" ng-reflect-model="true" class="ng-untouched ng-pristine ng-valid">
          <label _ngcontent-c7="" for="remission">Add remission</label>
        </div>
      </div>
      <div _ngcontent-c7="" class="remission-section" id="remission-section">
        <div _ngcontent-c7="" class="form-group">
            <label _ngcontent-c7="" class="form-label" for="remission-benefitier"><span _ngcontent-c7="" class="heading-small">Remission benefiter</span> (optional)</label>
            <input _ngcontent-c7="" class="form-control ng-untouched ng-pristine ng-valid" id="remission-benefitier" name="remission-benefitier" style="width: 366px" type="text" ng-reflect-name="remission-benefitier" ng-reflect-model="someone">
        </div>
        <div _ngcontent-c7="" class="form-group">
            <label _ngcontent-c7="" class="form-label" for="remission-amount"><span _ngcontent-c7="" class="heading-small">Remission amount</span></label>
            <input _ngcontent-c7="" appnumbersonly="true" class="form-control short-input ng-untouched ng-pristine ng-valid" id="remission-amount" name="remission-amount" type="text" ng-reflect-name="remission-amount" ng-reflect-model="30">
        </div>
        <div _ngcontent-c7="" class="form-group">
            <label _ngcontent-c7="" class="form-label" for="remission-authorisation"><span _ngcontent-c7="" class="heading-small">Remission authorisation</span></label>
            <input _ngcontent-c7="" class="form-control short-input ng-untouched ng-pristine ng-valid" id="remission-authorisation" name="remission-authorisation" type="text" ng-reflect-name="remission-authorisation" ng-reflect-model="auth123">
        </div>
      </div>
      <div _ngcontent-c7="" appvisible="" feature="payment-actions-refund">
        <div _ngcontent-c7="" class="form-group section">
          <div _ngcontent-c7="" class="multiple-choice">
            <input _ngcontent-c7="" id="refund" name="refund" type="checkbox" ng-reflect-name="refund" ng-reflect-is-disabled="true" ng-reflect-model="false" class="ng-untouched ng-pristine" disabled="">
            <label _ngcontent-c7="" for="refund">Add refund</label>
          </div>
        </div>
        <div _ngcontent-c7="" class="remission-section" id="refund-section" hidden="">
          <div _ngcontent-c7="" class="form-group">
              <label _ngcontent-c7="" class="form-label" for="refund-amount"><span _ngcontent-c7="" class="heading-small">Refund amount</span></label>
              <input _ngcontent-c7="" appnumbersonly="true" class="form-control short-input ng-untouched ng-pristine ng-valid" id="refund-amount" name="refund-amount" placeholder="" type="text" ng-reflect-name="refund-amount">
          </div>
        </div>
      </div>
      <div _ngcontent-c7="" class="section">
        <button _ngcontent-c7="" class="button" id="save">Save</button>
      </div>
      <div _ngcontent-c7="" class="section">
        <div _ngcontent-c7=""><a _ngcontent-c7="">Cancel</a></div>
      </div>
    </form>
  </div>
`
;
