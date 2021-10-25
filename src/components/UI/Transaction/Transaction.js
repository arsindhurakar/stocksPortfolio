import React, { useState, useEffect } from "react";
import "./Transaction.scss";
import { Form, Radio, Select, InputNumber, Input } from "antd";
import { Button } from "../../Layout";
import moment from "moment";
import { db } from "../../../firebase";
import { useAuth } from "../../../contexts/AuthContext";
import firebase from "../../../firebase";

const Transaction = ({ getStocksInHand, stocksInHand, stocksData }) => {
  const [action, setAction] = useState("buy");
  const [stockSelected, setStockSelected] = useState([]);

  const { Option } = Select;
  const [form] = Form.useForm();
  const { currentUser } = useAuth();

  useEffect(() => {
    getStocksInHand();
    form.setFieldsValue({
      pricePerUnit: stockSelected[0]?.pricePerUnit,
    });
  }, [stockSelected]);

  const handleStock = (value) => {
    setStockSelected(stocksData.filter(({ name }) => name === value));
  };

  const handleAction = (e) => {
    setAction(e.target.value);
    form.resetFields();
  };

  const onProceed = async (values) => {
    const { stock, quantity, pricePerUnit } = values;

    db.collection("transactions")
      .doc()
      .set({
        uid: currentUser.uid,
        action,
        stock,
        quantity,
        pricePerUnit,
        investment: quantity * pricePerUnit,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

    if (action === "buy") {
      db.collection("stocksInHand")
        .doc()
        .set({
          uid: currentUser.uid,
          stock,
          quantity,
          pricePerUnit,
          investment: quantity * pricePerUnit,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
    } else {
      const stocksInHand = await db
        .collection("stocksInHand")
        .where("stock", "==", stock)
        .where("uid", "==", currentUser.uid)
        .get();

      // console.log(stocksInHand?.docs[0].id);

      db.collection("stocksInHand")
        .doc(stocksInHand?.docs[0].id)
        .get()
        .then((doc) => {
          doc.ref.update({
            quantity: doc.data().quantity - quantity,
            investment: doc.data().investment - quantity * pricePerUnit,
          });

          db.collection("stocksSold")
            .doc()
            .set({
              uid: currentUser.uid,
              stock,
              quantity,
              soldAmount: quantity * pricePerUnit,
              investment: quantity * doc.data().pricePerUnit,
              // currentAmount: 200,
              profitLoss:
                quantity * pricePerUnit - quantity * doc.data().pricePerUnit,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
        });
    }
  };

  return (
    <div className="transaction">
      <Form form={form} onFinish={onProceed}>
        <div className="transaction__head">
          <p>{moment().format("LL")}</p>
          <Form.Item>
            <Radio.Group onChange={handleAction} value={action}>
              <Radio value="buy">Buy</Radio>
              <Radio value="sell">Sell</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <div className="transaction__stock">
          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: "Input Required" }]}
          >
            <Select onChange={handleStock}>
              {action === "buy"
                ? stocksData.map(({ id, name }) => (
                    <Option key={id} value={name}>
                      {name}
                    </Option>
                  ))
                : stocksInHand.map(({ stockID, stock }) => (
                    <Option key={stockID} value={stock}>
                      {stock}
                    </Option>
                  ))}
            </Select>
          </Form.Item>
        </div>
        <div className="transaction__quantityPrice">
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Input Required" }]}
          >
            <InputNumber
              min={10}
              max={100}
              // defaultValue={10}
            />
          </Form.Item>
          <Form.Item
            label="Price / Unit"
            name="pricePerUnit"
            rules={[{ required: true, message: "Input Required" }]}
          >
            <Input style={{ width: 80 }} />
          </Form.Item>
        </div>
        <div className="transaction__proceedBtn">
          <Form.Item>
            <Button>Proceed</Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default Transaction;
