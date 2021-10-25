import React, { useState, useEffect } from "react";
import "./Transaction.scss";
import { Form, Radio, Select, InputNumber, Input, Modal } from "antd";
import { Button } from "../../Layout";
import moment from "moment";
import { db } from "../../../firebase";
import { useAuth } from "../../../contexts/AuthContext";
import firebase from "../../../firebase";
import getFormattedAmount from "../../../utils/getFormattedAmount";

const Transaction = ({ getStocksInHand, stocksInHand, stocksData }) => {
  const [action, setAction] = useState("buy");
  const [stockSelected, setStockSelected] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [step, setStep] = useState(1);
  const [maxQuantity, setMaxQuanity] = useState(0);
  const [isQuantityVisible, setIsQuantityVisible] = useState(false);

  const { Option } = Select;
  const [form] = Form.useForm();
  const { currentUser } = useAuth();

  useEffect(() => {
    getStocksInHand();
    form.setFieldsValue({
      pricePerUnit: stockSelected[0]?.pricePerUnit,
    });
  }, [stockSelected]);

  const handleCancel = () => {
    setIsModalVisible(false);
    setStep(1);
  };

  const handleStock = (value) => {
    const stock = stocksData.filter(({ name }) => name === value);
    setStockSelected(stock);

    action === "sell" &&
      db
        .collection("stocksInHand")
        .where("uid", "==", currentUser.uid)
        .where("stock", "==", stock[0]?.name)
        .get()
        .then((querySnapshot) =>
          querySnapshot.forEach((doc) => setMaxQuanity(doc.data().quantity))
        );

    action === "sell" && setIsQuantityVisible(true);

    // console.log(stock[0].name, currentUser.uid);
  };

  // console.log("stockSelected", stockSelected);

  const handleAction = (e) => {
    setAction(e.target.value);
    form.resetFields();
    setIsQuantityVisible(false);
  };

  const handleProceed = (values) => {
    setIsModalVisible(true);
    setFormValues(values);
  };

  const switchForm = () => {
    switch (step) {
      case 1: {
        return (
          <div className="transaction__modal">
            <p>
              Name: <span>{formValues.stock}</span>
            </p>
            <p>
              Quantity: <span>{formValues.quantity} units</span>
            </p>
            <p>
              Price/Unit:{" "}
              <span>Rs. {getFormattedAmount(formValues.pricePerUnit)}</span>
            </p>
            <p>
              Amount:{" "}
              <span>
                Rs.{" "}
                {getFormattedAmount(
                  formValues.pricePerUnit * formValues.quantity
                )}
              </span>
            </p>
          </div>
        );
      }
      case 2: {
        return <p>Trading Successful</p>;
      }
      default:
        break;
    }
  };

  const handleProcessing = async () => {
    const { stock, quantity, pricePerUnit } = formValues;

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
      const stockInHand = await db
        .collection("stocksInHand")
        .where("stock", "==", stock)
        .where("uid", "==", currentUser.uid)
        .get();

      await db
        .collection("stocksInHand")
        .doc(stockInHand?.docs[0].id)
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
              profitLoss:
                quantity * pricePerUnit - quantity * doc.data().pricePerUnit,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
        });

      await db
        .collection("stocksInHand")
        .doc(stockInHand?.docs[0].id)
        .get()
        .then((doc) => doc.data().quantity === 0 && doc.ref.delete());
    }
    form.resetFields();
    setStep(step + 1);

    isQuantityVisible && setIsQuantityVisible(false);
  };

  const getAvailableStocks = () => {
    const stocks = stocksInHand.map(({ stock }) => stock);
    return stocksData.filter(({ name }) => !stocks.includes(name));
  };

  return (
    <div className="transaction">
      <Form form={form} onFinish={handleProceed}>
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
                ? getAvailableStocks().map(({ id, name }) => (
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
              max={action === "sell" && maxQuantity}
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
        {isQuantityVisible && (
          <p className="transaction__maxQuantityDesc">
            Quantity Available: <span>{maxQuantity} units </span>
          </p>
        )}
        <div className="transaction__proceedBtn">
          <Form.Item>
            <Button>Proceed</Button>
          </Form.Item>
        </div>
      </Form>
      <Modal
        title={action === "buy" ? "Buy Stock?" : "Sell Stock?"}
        visible={isModalVisible}
        // onOk={handleProcessing}
        onCancel={handleCancel}
        footer={
          step === 1 && [
            <Button
              key={action === "buy" ? "buy" : "sell"}
              onClick={handleProcessing}
            >
              {action === "buy" ? "Purchase" : "Sell"}
            </Button>,
          ]
        }
      >
        {switchForm()}
      </Modal>
    </div>
  );
};

export default Transaction;
