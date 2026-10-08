#include <iostream>
#include <vector>
#include <string>

using namespace std;

// Module VI: Structures
struct Customer {
    int accountNumber;
    string name; 
    double balance;
};

// Module II: Functions and Decision Making Statements
int findCustomerIndex(vector<Customer>& bank, int accNo) {
    // Module III / X: Traversing an array / vector
    for (int i = 0; i < bank.size(); i++) {
        if (bank[i].accountNumber == accNo) {
            return i;
        }
    }
    return -1;
}

void addCustomer(vector<Customer>& bank) {
    int accNo;
    cout << "Enter Account Number: ";
    cin >> accNo;

    // Edge Case: Prevent duplicate account numbers
    if (findCustomerIndex(bank, accNo) != -1) {
        cout << "Error: Account number already exists!\n";
        return;
    }

    Customer newCustomer;
    newCustomer.accountNumber = accNo;
    
    cout << "Enter Customer Name: ";
    cin >> newCustomer.name;

    double balance;
    cout << "Enter Initial Balance: ";
    cin >> balance;
    
    // Edge Case: Prevent negative starting balance
    while (balance < 0) {
        cout << "Balance cannot be negative. Try again: ";
        cin >> balance;
    }
    newCustomer.balance = balance;

    // Module X: STL Containers (Vectors with dynamic resizing)
    bank.push_back(newCustomer); 
    cout << "Customer added successfully!\n";
}

void displayCustomers(vector<Customer>& bank) {
    // Edge Case: Empty bank records
    if (bank.size() == 0) {
        cout << "No customers found.\n";
        return;
    }
    cout << "\n--- All Customers ---\n";
    for (int i = 0; i < bank.size(); i++) {
        cout << "Acc No: " << bank[i].accountNumber 
             << " | Name: " << bank[i].name 
             << " | Balance: " << bank[i].balance << "\n";
    }
}

void searchCustomer(vector<Customer>& bank) {
    if (bank.size() == 0) {
        cout << "Bank is empty.\n";
        return;
    }
    
    int accNo;
    cout << "Enter Account Number to search: ";
    cin >> accNo;
    
    int index = findCustomerIndex(bank, accNo);
    if (index != -1) {
        cout << "Name: " << bank[index].name << " | Balance: " << bank[index].balance << "\n";
    } else {
        cout << "Customer not found.\n";
    }
}

void depositMoney(vector<Customer>& bank) {
    if (bank.size() == 0) {
        cout << "Bank is empty.\n";
        return;
    }
    
    int accNo;
    cout << "Enter Account Number for Deposit: ";
    cin >> accNo;
    
    int index = findCustomerIndex(bank, accNo);
    if (index == -1) {
        cout << "Account not found.\n";
        return;
    }

    double amount;
    cout << "Enter amount to deposit: ";
    cin >> amount;
    
    if (amount <= 0) {
        cout << "Deposit amount must be greater than zero.\n";
        return;
    }

    bank[index].balance = bank[index].balance + amount;
    cout << "Deposited! New Balance: " << bank[index].balance << "\n";
}

void withdrawMoney(vector<Customer>& bank) {
    if (bank.size() == 0) {
        cout << "Bank is empty.\n";
        return;
    }
    
    int accNo;
    cout << "Enter Account Number for Withdrawal: ";
    cin >> accNo;
    
    int index = findCustomerIndex(bank, accNo);
    if (index == -1) {
        cout << "Account not found.\n";
        return;
    }

    double amount;
    cout << "Enter amount to withdraw: ";
    cin >> amount;
    
    if (amount <= 0) {
        cout << "Withdrawal amount must be greater than zero.\n";
        return;
    }
    
    // Edge case: Insufficient funds
    if (amount > bank[index].balance) {
        cout << "Insufficient balance! Current Balance is " << bank[index].balance << "\n";
        return;
    }

    bank[index].balance = bank[index].balance - amount;
    cout << "Withdrawn! New Balance: " << bank[index].balance << "\n";
}

void displayBalance(vector<Customer>& bank) {
    if (bank.size() == 0) {
        cout << "Bank is empty.\n";
        return;
    }
    
    int accNo;
    cout << "Enter Account Number: ";
    cin >> accNo;
    
    int index = findCustomerIndex(bank, accNo);
    if (index != -1) {
        cout << "Balance for " << bank[index].name << " is " << bank[index].balance << "\n";
    } else {
        cout << "Account not found.\n";
    }
}

void displayHighestBalance(vector<Customer>& bank) {
    if (bank.size() == 0) {
        cout << "Bank is empty.\n";
        return;
    }
    
    int highestIndex = 0;
    for (int i = 1; i < bank.size(); i++) {
        if (bank[i].balance > bank[highestIndex].balance) {
            highestIndex = i;
        }
    }
    
    cout << "Customer with Highest Balance -> Acc No: " << bank[highestIndex].accountNumber 
         << " | Name: " << bank[highestIndex].name 
         << " | Balance: " << bank[highestIndex].balance << "\n";
}

void sortCustomersByBalance(vector<Customer>& bank) {
    if (bank.size() == 0) {
        cout << "Bank is empty.\n";
        return;
    }
    
    int n = bank.size();
    // Bubble sort algorithm 
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (bank[j].balance < bank[j + 1].balance) {
                Customer temp = bank[j];
                bank[j] = bank[j + 1];
                bank[j + 1] = temp;
            }
        }
    }
    cout << "Customers sorted by balance.\n";
}

int main() {
    vector<Customer> bankRecords; 
    int choice;

    do {
        cout << "\n--- BANK MANAGEMENT SYSTEM ---\n";
        cout << "1. Add a new customer\n";
        cout << "2. Display all customers\n";
        cout << "3. Search customer by account number\n";
        cout << "4. Deposit money\n";
        cout << "5. Withdraw money\n";
        cout << "6. Display account balance\n";
        cout << "7. Find customer with highest balance\n";
        cout << "8. Sort customers by balance\n";
        cout << "9. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
            case 1: 
                addCustomer(bankRecords); 
                break;
            case 2: 
                displayCustomers(bankRecords); 
                break;
            case 3: 
                searchCustomer(bankRecords); 
                break;
            case 4: 
                depositMoney(bankRecords); 
                break;
            case 5: 
                withdrawMoney(bankRecords); 
                break;
            case 6: 
                displayBalance(bankRecords); 
                break;
            case 7: 
                displayHighestBalance(bankRecords); 
                break;
            case 8: 
                sortCustomersByBalance(bankRecords); 
                displayCustomers(bankRecords); 
                break;
            case 9: 
                cout << "Exiting system.\n"; 
                break;
            default: 
                cout << "Invalid choice! Enter a number between 1 and 9.\n";
        }
    } while (choice != 9);

    return 0;
}
