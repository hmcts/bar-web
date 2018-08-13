// tslint:disable:no-trailing-whitespace
// tslint:disable:max-line-length
export const feelogMainCompHtml =
`<div _ngcontent-c2="" class="title">
<div _ngcontent-c2="">
  <h1 _ngcontent-c2="" class="heading-xlarge">Validate payment</h1>
</div>
<div _ngcontent-c2="" class="action" feature="readonly-pending-rejected" hidden>
  <div _ngcontent-c2="" class="action-form form-group" ng-reflect-klass="action-form form-group" ng-reflect-ng-class="[object Object]">
    <label _ngcontent-c2="" for="action">
      <span _ngcontent-c2="">Action:</span>
      <span _ngcontent-c2="" class="error-message">Select an action to payment</span>
    </label>
    <div _ngcontent-c2="" class="col-sm-10">
        <select _ngcontent-c2="" class="form-control" id="action" name="action" required="" ng-reflect-klass="form-control" ng-reflect-ng-class="[object Object]">
          <option _ngcontent-c2="" disabled="" selected="" value="" ng-reflect-value="">Select</option>
          <option _ngcontent-c2="" appvisible="" feature="payment-actions-process" value="1" ng-reflect-value="1">Process</option>
          <option _ngcontent-c2="" appvisible="" feature="payment-actions-suspense" value="2" ng-reflect-value="2">Suspense</option>
          <option _ngcontent-c2="" appvisible="" feature="payment-actions-return" value="3" ng-reflect-value="3">Return</option>
        </select>
      <input _ngcontent-c2="" class="button" type="button" value="Submit">
    </div>
  </div>
</div>
</div>

<!--bindings={
"ng-reflect-ng-if": "false"
}-->

<div _ngcontent-c2="">
<h2 _ngcontent-c2="" class="heading-large">Payment details</h2>
</div>

<div _ngcontent-c2="" class="section">
<table _ngcontent-c2="" id="payment-instruction">
  <thead _ngcontent-c2="">
    <tr _ngcontent-c2="">
      <th _ngcontent-c2="">ID</th>
      <th _ngcontent-c2="" style="width: 33%">Name</th>
      <th _ngcontent-c2="">Type</th>
      <th _ngcontent-c2="">Reference</th>
      <th _ngcontent-c2="">Amount</th>
      <th _ngcontent-c2="">Action</th>
      <th _ngcontent-c2=""></th>
    </tr>
  </thead>
  <tbody _ngcontent-c2="" class="bar-feelogs-th">
    <tr _ngcontent-c2="" class="bar-feelogs-th">
      <td _ngcontent-c2="" class="bar-feelogs-td">
        2
      </td>
      <td _ngcontent-c2="" class="bar-feelogs-td">
        Jane Doe
      </td>
      <td _ngcontent-c2="" class="bar-feelogs-td">
        Cheque
      </td>
      <td _ngcontent-c2="" class="bar-feelogs-td">
        123456
      </td>
      <td _ngcontent-c2="" class="bar-feelogs-td amount">
        £650.00
      </td>
      <td _ngcontent-c2="" class="bar-feelogs-td">

      </td>
      <td _ngcontent-c2="" class="bar-feelogs-td text-align-right">
        <a _ngcontent-c2="" class="button button-edit" href="/feelog/edit/3/change-payment" role="button" ng-reflect-router-link="/feelog/edit/3/change-payment">Edit</a>
      </td>
    </tr>
  </tbody>
</table>
</div>

<div _ngcontent-c2="" class="section">
<input _ngcontent-c2="" class="button button-add" type="submit" value="Add payment">
</div>

<!--bindings={
"ng-reflect-ng-if": "true"
}--><div _ngcontent-c2="" class="section">
<div _ngcontent-c2="">
  <h2 _ngcontent-c2="" class="heading-large">Case and fee details</h2>
</div>
<table _ngcontent-c2="" id="fee-details">
  <thead _ngcontent-c2="">
    <tr _ngcontent-c2="">
      <th _ngcontent-c2="">Case number</th>
      <th _ngcontent-c2="" style="width: 33%">Fee description</th>
      <th _ngcontent-c2="">Fee amount</th>
      <th _ngcontent-c2="">Remission amount</th>
      <th _ngcontent-c2="">Refund amount</th>
      <th _ngcontent-c2=""></th>
    </tr>
  </thead>
  <tbody _ngcontent-c2="" class="bar-feelogs-th">
    <!--bindings={
"ng-reflect-ng-for-of": "[object Object],[object Object"
}--><tr _ngcontent-c2="" class="bar-feelogs-th">
      <td _ngcontent-c2="" class="bar-feelogs-td">
        ccc111
      </td>
      <td _ngcontent-c2="" class="bar-feelogs-td">
        Recovery of Land - High Court
      </td>
      <td _ngcontent-c2="" class="bar-feelogs-td">
        £480.00
      </td>
      <td _ngcontent-c2="" class="bar-feelogs-td">
        £30.00
      </td>
      <td _ngcontent-c2="" class="bar-feelogs-td amount">

      </td>
      <td _ngcontent-c2="" class="bar-feelogs-td text-align-right">
        <!--bindings={
"ng-reflect-ng-if": "true"
}--><button _ngcontent-c2="" class="button button-edit">Edit</button>
        <!--bindings={
"ng-reflect-ng-if": "true"
}--><div _ngcontent-c2="" class="remove-link"><a _ngcontent-c2="">Remove</a></div>
      </td>
    </tr><tr _ngcontent-c2="" class="bar-feelogs-th">
      <td _ngcontent-c2="" class="bar-feelogs-td">
        ccc111
      </td>
      <td _ngcontent-c2="" class="bar-feelogs-td">
        Special guardianship orders (section 14A(3) or (6)(a), 14C(3) or 14D(1))
      </td>
      <td _ngcontent-c2="" class="bar-feelogs-td">
        £215.00
      </td>
      <td _ngcontent-c2="" class="bar-feelogs-td">
        £15.00
      </td>
      <td _ngcontent-c2="" class="bar-feelogs-td amount">

      </td>
      <td _ngcontent-c2="" class="bar-feelogs-td text-align-right">
        <!--bindings={
"ng-reflect-ng-if": "true"
}--><button _ngcontent-c2="" class="button button-edit">Edit</button>
        <!--bindings={
"ng-reflect-ng-if": "true"
}--><div _ngcontent-c2="" class="remove-link"><a _ngcontent-c2="">Remove</a></div>
      </td>
    </tr>
  </tbody>
</table>
<div _ngcontent-c2="" class="section">
  <button _ngcontent-c2="" class="button button-add">Add case and fee details</button>
</div>
</div>
`;
