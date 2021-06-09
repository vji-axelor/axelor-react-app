import React from "react";
import axios from "axios";
import FieldList from './FieldList'

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: [],
      model: ""
    };

    this.getFieldList = this.getFieldList.bind(this);
    this.handeModelChange = this.handeModelChange.bind(this);
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
        this.setState({
          fields: fields
        });
        console.log(this.state);
      })
      .catch(error => {
        console.log(error);
      });
  }

  handeModelChange(event) {
    this.setState({
      model: event.target.value
    });
  }

  render() {
    const { model, fields } = this.state;
    // const item = fields.map(field =>    <div> {field.title} : <input  /> </div>
    // );

    const fieldList = fields.length !== 0 && <FieldList fields={fields} domain={this.state.model} />

    return (
      <div>
        <input
          type="text"
          name="model"
          value={model}
          onChange={this.handeModelChange}
        />
        <br />
        <button onClick={this.getFieldList}>Fetch Field</button><br/>
        {fieldList}
      </div>
    );
  }
}

export default Home;
