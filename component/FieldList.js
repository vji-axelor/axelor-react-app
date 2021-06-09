import React from "react";
import axios from "axios";

class FieldList extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeHendler = this.onChangeHendler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
   
    this.state = {
      fieldData: [],
      model: ""
    };
  }

  componentDidMount(){
    var fieldList = [];

    this.props.fields.forEach(element => {
      element["value"] = "";
      fieldList.push(element);
    });

    this.setState({
      fieldData :fieldList,
      model:this.props.domain
    })
  }

  onChangeHendler(e, index) {
    this.state.fieldData[index].value = e.target.value;
    this.setState({
      fieldData: this.state.fieldData
    });
  }

  submitHandler(e) {
    e.preventDefault();
    var data = {};
    data["domain"] = this.state.model;
    this.state.fieldData.forEach(element => {
      element.value !== null &&
        element.value !== "" &&
        (data[element.field] = element.value);
    });

    console.log(data);

    axios
      .post(
        "/axelor-erp/ws/action/",
        {
          action: "com.axelor.apps.zapier.web.ZapierController:createRecord",
          data: data
        },
        {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      )
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { fieldData } = this.state;

    const fieldList = fieldData.map(
      (field, index) =>
        field.field !== "importOrigin" &&
        field.field !== "updatedBy" &&
        field.field !== "updatedOn" &&
        field.field !== "createdOn" &&
        field.field !== "version" &&
        field.field !== "attrs" &&
        field.field !== "archived" &&
        field.field !== "importId" &&
        field.field !== "createdBy" &&
        field.field !== "id" &&
        field.field !== "selected" && (
          <div key={index}>
            {field.title === null || field.title === ""
              ? field.field
              : field.title}
            <input
              type="text"
              name={field.field}
              value={field.value}
              onChange={e => this.onChangeHendler(e, index)}
            />
          </div>
        )
    );

    return (
      <div>
        <form onSubmit={this.submitHandler}>
          {fieldList}
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default FieldList;
