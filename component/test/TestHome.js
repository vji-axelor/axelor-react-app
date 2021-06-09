import React from "react";
import axios from "axios";
import "./../../App.css";
import "./inputField.css";

class TestHome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldData: [],
      model: ""
    };

    this.getFieldList = this.getFieldList.bind(this);
    this.handeModelChange = this.handeModelChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  getFieldList() {
    axios
      .post(
        "/axelor-erp/ws/action/",
        {
          action: "com.axelor.apps.zapier.web.ZapierController:getMetaFields",
          data: {
            domain: this.state.model
          }
        },
        {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      )
      .then(response => {
        const fields = response.data.data[0].values.fields;

        var fieldList = [];

        fields.forEach(element => {
          element["value"] = "";
          fieldList.push(element);
        });

        var requiredFields = fieldList.filter(
          a => a.require === true && a.title !== null && a.title !== ""
        );
        requiredFields = requiredFields.sort(function(a, b) {
          // var x = a.field.toUpperCase();
          // var y = b.field.toUpperCase();
          var x = a.title;
          var y = b.title;
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        });

        var notRequiredFields = fieldList.filter(
          a => a.require === false && a.title !== null && a.title !== ""
        );

        notRequiredFields = notRequiredFields.sort(function(a, b) {
          // var x = a.label.toLowerCase();
          // var y = b.label.toLowerCase();
          var x = a.title;
          var y = b.title;
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        });

        var noTitleField = fieldList.filter(a => a.title === null);

        var modelFields = requiredFields
          .concat(notRequiredFields)
          .concat(noTitleField);

        this.setState({
          fieldData: modelFields
        });
      })
      .catch(error => {
        alert(error);
        // throw new Error(error);
        return <h1>{error}</h1>;
      });
  }

  handeModelChange(event) {
    this.setState({
      model: event.target.value,
      fieldData: []
    });
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
        if (response.data.status === 0) {
          alert("Record Inserted ..!!");
          this.setState({
            fieldData: []
          });
        }
        if (response.data.status === -1) {
          alert(response.data.data[0].flash);
          throw new Error(response.data.data[0].flash);
        }
      })
      .catch(error => {
        // throw new Error(error);
        return <h1>{error}</h1>;
      });
  }

  render() {
    const { model, fieldData } = this.state;

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
            {field.title === null || field.title === "" ? (
              <label>
                {field.field}{" "}
                <span className="Home-help-text">(Type: {field.type})</span>{" "}
              </label>
            ) : (
              <label>
                {field.title}
                {field.require === true ? (
                  <span className="Home-help-text">
                    {" "}
                    (Type: {field.type},{" "}
                    <span className="Home-help-text Home-text-alert">
                      required
                    </span>{" "}
                    )
                  </span>
                ) : (
                  <span className="Home-help-text"> (Type: {field.type}) </span>
                )}
              </label>
            )}

            {field.require === true ? (
              <input
                className="Home-input"
                type="text"
                name={field.field}
                value={field.value}
                required
                onChange={e => this.onChangeHendler(e, index)}
              />
            ) : (
              <input
                className="Home-input"
                type="text"
                name={field.field}
                value={field.value}
                onChange={e => this.onChangeHendler(e, index)}
              />
            )}
          </div>
        )
    );

    return (
      <div className="Home-div-content">
        <div className="Home-axelor">
          <h1>
            a<span className="Home-axelor-span">X</span>elor
          </h1>
        </div>
        <hr className="Home-hr" />
        <div className="Home-div Home-div-shadow">
          <div>
            <label>Model Name</label>
            <br />
            <input
              className="Home-input"
              type="text"
              name="model"
              value={model}
              onChange={this.handeModelChange}
            />
          </div>
          <br />

          <button
            onClick={this.getFieldList}
            className="Home-button Button-field"
          >
            Fetch Field
          </button>
          {fieldData.length !== 0 && <hr />}
          <br />
          <form onSubmit={this.submitHandler}>
            {fieldList}

            {fieldData.length !== 0 && (
              <button type="submit" className="Home-button Button-submit">
                Submit
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }
}

export default TestHome;
