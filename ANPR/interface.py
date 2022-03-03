import importlib.util
import subprocess
import os

def main():
    # spec = importlib.util.spec_from_file_location('some_function', './addition.py')
    # foo = importlib.util.module_from_spec(spec)
    # spec.loader.exec_module(foo)
    # foo.main()
    os.system('python3 ./addition.py --name abdullah')
if __name__ == '__main__':
    main()
