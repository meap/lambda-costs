# What is this?

This node.js script provides a solution to calculate the costs associated with AWS Lambda functions. It automates the process of retrieving Lambda metrics using the AWS SDK, calculates costs based on metrics like memory usage, invocations, and execution time, and generates a detailed cost report in a CSV file.

# How to Use

The script requires access to an AWS account in the specified region. This can be achieved by setting up environment variables.

```
export AWS_ACCESS_KEY_ID=•••••
export AWS_SECRET_ACCESS_KEY=•••••
export AWS_REGION=us-east-1
```

Next, clone the repository and install the dependency.

```
git clone git@github.com:meap/lambda-costs.git
cd lambda-costs/
npm install
```

Define the period (by months) for which you want to get metrics in the costs.js file. And run the command:

```
npm run start
```

# Output

The output is in CSV format and can be easily imported into Google Sheets. Here is an example of the output. 

| FunctionName   |   MemoryAllocatedMB |   EphemeralStorageMB |   Invocations |   DurationMilliseconds |   InvocationCostUSD |   DurationCostUSD |   StorageCostUSD |   TotalCostUSD |
|:---------------|--------------------:|---------------------:|--------------:|-----------------------:|--------------------:|------------------:|-----------------:|---------------:|
| Owl            |                4096 |                 3072 |       2863583 |            24020100000 |            0.572717 |          1601.34  |          540.451 |         2142.37|
| Kangaroo       |                6144 |                 3072 |         45838 |              468853000 |            0.009168 |            46.8854|           10.5492|           57.44|
| Lion           |                2048 |                  512 |        909772 |              222943000 |            0.181954 |             7.4314|            0     |            7.61|
| Zebra          |                3072 |                  512 |        343025 |               99898100 |            0.068605 |             4.9949|            0     |            5.06|
| Dolphin        |                1024 |                  512 |        286866 |              221931000 |            0.057373 |             3.6988|            0     |            3.76|
| Fox            |                 128 |                  512 |       2910858 |              396841000 |            0.582172 |             0.8268|            0     |            1.41|
| Fox2           |                 256 |                  512 |        439937 |               89945100 |            0.087987 |             0.3748|            0     |            0.46|
| Eagle          |                 512 |                  512 |        308730 |               38817400 |            0.061746 |             0.3235|            0     |            0.39|
| Wolf           |                 128 |                  512 |       1033464 |               75264300 |            0.206693 |             0.1568|            0     |            0.36|
| Tiger          |                 512 |                  512 |          7916 |               35873400 |            0.001583 |             0.2989|            0     |            0.30|
| Shark          |                 256 |                  512 |         36314 |               14437600 |            0.007263 |             0.0602|            0     |            0.07|
| Lion           |                 128 |                  512 |        239206 |                4662100 |            0.047841 |             0.0097|            0     |            0.06|
| Panda          |                 256 |                  512 |          9243 |               11347500 |            0.001849 |             0.0473|            0     |            0.05|
| Wolf           |                 256 |                  512 |         17194 |                9805070 |            0.003439 |             0.0409|            0     |            0.04|
| Elephant       |                 256 |                  512 |         13223 |                6913890 |            0.002645 |             0.0288|            0     |            0.03|
| Penguin        |                 256 |                  512 |          3534 |                7307320 |            0.000707 |             0.0304|            0     |            0.03|
| Kangaroo       |                 256 |                  512 |         20642 |                2920700 |            0.004128 |             0.0122|            0     |            0.02|
| Rabbit         |                 256 |                  512 |          8515 |                2815730 |            0.001703 |             0.0117|            0     |            0.01|
| Deer           |                 128 |                  512 |          8526 |                4349520 |            0.001705 |             0.0091|            0     |            0.01|
| Giraffe        |                 128 |                  512 |          8525 |                4252260 |            0.001705 |             0.0089|            0     |            0.01|
| Leopard        |                 256 |                  512 |          6485 |                1627210 |            0.001297 |             0.0068|            0     |            0.01|
| Bear           |                 256 |                  512 |           802 |                 751782 |            0.00016  |             0.0031|            0     |            0.00|
| Giraffe        |                 256 |                  512 |           193 |                 760083 |            0.000039 |             0.0032|            0     |            0.00|
| Dolphin        |                 256 |                  512 |           194 |                 345630 |            0.000039 |             0.0014|            0     |            0.00|
| Shark          |                1024 |                  512 |            92 |                  56241 |            0.000018 |             0.0009|            0     |            0.00|
| Elephant       |                 128 |                  512 |           197 |                 236965 |            0.000039 |             0.0005|            0     |            0.00|
| Deer           |                 256 |                  512 |            53 |                 108903 |            0.000011 |             0.0005|            0     |            0.00|
| Tiger          |                 128 |                  512 |           821 |                 142713 |            0.000164 |             0.0003|            0     |            0.00|
| Koala          |                 256 |                  512 |            48 |                  56567 |            0.00001  |             0.0002|            0     |            0.00|
| Zebra          |                 128 |                  512 |             6 |                  15816 |            0.000001 |             0.0000|            0     |            0.00|
| Leopard        |                 128 |                  512 |             2 |                   3872 |            0        |             0.0000|            0     |            0.00|
| Panda          |                 256 |                  512 |             0 |                      0 |            0        |             0     |            0     |            0.00|
| Eagle          |                 256 |                  512 |             0 |                      0 |            0        |             0     |            0     |            0.00|
| Hawk           |                 256 |                  512 |             0 |                      0 |            0        |             0     |            0     |            0.00|
| Owl            |                 256 |                  512 |             0 |                      0 |            0        |             0     |            0     |            0.00|
| Rabbit         |                1024 |                  512 |             0 |                      0 |            0        |             0     |            0     |            0.00|

# License

The MIT License.
