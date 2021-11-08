# Description

A multi-step, multi-system automation for filling in data in our budgeting worksheet

V1 process (steps 1 and 2 are currently manual):

1. Find most recent transaction in budgeting worksheet (most recent transaction in google sheets)
2. Download all transactions from last transaction from Bank of America (currently manual)
3. Classify transactions in AWS
4. Get or create a sheet for the current month
5. Review data
6. Add new transactions to budgeting worksheet
