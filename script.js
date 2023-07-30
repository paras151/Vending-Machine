// State interface
class VendingMachineState {
    insertCoin(coinValue) {}
    selectItem(itemId) {}
    cancelTransaction() {}
    dispenseItem(itemId) {
        this.currentState.dispenseItem(itemId);
    }
  }
  
  // Concrete state classes
  class NoCoinState extends VendingMachineState {
    constructor(vendingMachine) {
      super();
      this.vendingMachine = vendingMachine;
    }
  
    insertCoin(coinValue) {
      this.vendingMachine.balance += coinValue;
      this.vendingMachine.changeState(new HasCoinState(this.vendingMachine));
      this.vendingMachine.updateDisplay(`Inserted: ₹${coinValue.toFixed(2)}`);
    }
  
    selectItem(itemId) {
      this.vendingMachine.updateDisplay("Please insert a coin first.");
    }
  
    cancelTransaction() {
      this.vendingMachine.updateDisplay("No transaction to cancel.");
    }

    dispenseItem(itemId) {
        this.vendingMachine.updateDisplay("No item to dispense");
    }
  }
  
  class HasCoinState extends VendingMachineState {
    constructor(vendingMachine) {
      super();
      this.vendingMachine = vendingMachine;
    }
  
    insertCoin(coinValue) {
      this.vendingMachine.balance += coinValue;
      this.vendingMachine.updateDisplay(`Inserted: ₹${coinValue.toFixed(2)}`);
    }
  
    selectItem(itemId) {
        const item = this.vendingMachine.items.find((item) => item.id === itemId);
        if (item && item.quantity > 0) {
          if (this.vendingMachine.balance >= item.price) {
            this.vendingMachine.selectedItem = item;
            this.vendingMachine.balance -= item.price;
            item.quantity--;
            this.vendingMachine.changeState(new DispensingState(this.vendingMachine, itemId));
            this.vendingMachine.updateDisplay(`You selected ${item.name}. Click to dispense item`);
          } else {
            this.vendingMachine.updateDisplay("Insufficient balance. Please insert more coins.");
          }
        } else {
          this.vendingMachine.updateDisplay("Item not available.");
        }
      }
  
    cancelTransaction() {
      var balance = this.vendingMachine.balance;
      this.vendingMachine.changeState(new NoCoinState(this.vendingMachine));
      this.vendingMachine.refundBalance();
      this.selectedItem = undefined;
      this.vendingMachine.updateDisplay(`Amount refunded: ${balance.toFixed(2)}`);
    }

    dispenseItem(itemId) {
        this.vendingMachine.updateDisplay("No item to dispense");
    }
  }
  
  class DispensingState extends VendingMachineState {
    constructor(vendingMachine, item) {
      super();
      this.vendingMachine = vendingMachine;
    }
  
    insertCoin(coinValue) {
      this.vendingMachine.updateDisplay("Transaction in progress. Please wait.");
    }
  
    dispenseItem(item) {

            var balance = this.vendingMachine.balance;
            this.vendingMachine.refundBalance();
            this.vendingMachine.updateDisplay(`You got ${item.name}. Amount refunded: ₹${balance.toFixed(2)}`);
            this.vendingMachine.changeState(new NoCoinState(this.vendingMachine));

        }
  
    cancelTransaction() {
        var balance = this.vendingMachine.balance;
        this.vendingMachine.changeState(new NoCoinState(this.vendingMachine));
        this.vendingMachine.refundBalance();
        this.selectedItem = undefined;
        this.vendingMachine.updateDisplay(`Amount refunded: ${balance.toFixed(2)}`);
    }

  }
  
  // VendingMachine class (Context)
  class VendingMachine {
    constructor() {
      this.balance = 0.00;
      this.selectedItem = 0;
      this.items = [
        { id: 1, name: "Soda", price: 30, quantity: 2 },
        { id: 2, name: "Chips", price: 10, quantity: 2 },
        // Add more items as needed
      ];
      this.currentState = new NoCoinState(this);
    }
  
    changeState(newState) {
      this.currentState = newState;
    }
  
    updateDisplay(message) {
      document.getElementById("message").textContent = message;
      document.getElementById("balance").textContent = `Balance: ₹${this.balance.toFixed(2)}`;
    }
  
    insertCoin(coinValue) {
      this.currentState.insertCoin(coinValue);
    }
  
    selectItem(itemId) {
      this.currentState.selectItem(itemId);
    }
  
    cancelTransaction() {
      this.currentState.cancelTransaction();
    }
  
    refundBalance() {
      this.balance = 0.00;
    }

    dispenseItem(itemId) {
        this.currentState.dispenseItem(itemId);
    }
  }
  
  // Create a new vending machine instance
  const vendingMachine = new VendingMachine();
  
  // Event listeners for buttons
document.getElementById("insert-10").addEventListener("click", () => vendingMachine.insertCoin(10));
document.getElementById("insert-20").addEventListener("click", () => vendingMachine.insertCoin(20));
document.getElementById("insert-50").addEventListener("click", () => vendingMachine.insertCoin(50));
document.getElementById("cancel").addEventListener("click", () => vendingMachine.cancelTransaction());
document.getElementById("dispense").addEventListener("click", () => vendingMachine.dispenseItem(vendingMachine.selectedItem));

  // Initial display setup
  vendingMachine.updateDisplay("Insert coins and select an item.");
  