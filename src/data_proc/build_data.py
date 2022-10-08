import pandas as pd
import argparse
import os

import warnings
warnings.filterwarnings("ignore")

msg = "This is still an unstable script. Use with caution.\nThe output has to be /data/data.csv for the 3d renderer to access the data."

parser = argparse.ArgumentParser(description=msg)
parser.add_argument("--smooth", action = "store_true", help = "Can be used to smoothen (using 3SMA) already processed 3d data (1 for True and 0 for False).\nOnly an input file needed with this flag.")
parser.add_argument("-i", "--input", type = str, help = "Path of the csv for data.")
parser.add_argument("-o", "--output", type = str, help = "Path of the csv for output.")
parser.add_argument("-m", "--measure", type = int, help = "1: Median\n2: Mean")
args = parser.parse_args()

err = False

def smooth(inputf, outputf):
    df = pd.read_csv(inputf)
    df = df.rolling(3).mean() # 3SMA
    df.dropna(inplace=True)
    df.to_csv(outputf, index=False)

def add_row(df):
    col_count = len(df.columns)
    col_names = [f"{i}" for i in range(0, col_count)]
    df.columns = col_names
    df.drop(str(col_count-1), axis=1, inplace=True)
    df = df.T
    col_count = len(df.columns)
    col_names = [f"{i}_deg" for i in range(0, 181)]
    df.columns = col_names
    switcher = {
        1: df.median(),
        2: df.mean()
    }
    data = switcher.get(args.measure)
    if not os.path.isfile(args.output):
        with open(args.output, "w"):
            pass
        new_df = pd.DataFrame(columns = col_names)
        new_df.to_csv(args.output, index=False)
    prior_data = pd.read_csv(args.output)
    prior_data = prior_data.append(data, ignore_index=True)
    prior_data = prior_data.round(decimals=2)
    prior_data.to_csv(args.output, index=False)

def build():
    df = pd.read_csv(args.input)
    i = 0
    while (i+181) <= df.shape[0]:
        add_row(df.iloc[i: i+181])
        i += 181

if args.smooth:
    if args.input and args.output and args.measure:
        if args.measure == 1 or args.measure == 2:
            build()
            smooth(args.output, args.output)
        else:
            err = True
    elif args.input and args.output:
        smooth(args.input, args.output)
    else:
        err = True
elif args.input and args.output and args.measure:
    if args.measure == 1 or args.measure == 2:
        build()
    else:
        err = True
else:
    err = True

if err:
    print("Use -h for help.")
