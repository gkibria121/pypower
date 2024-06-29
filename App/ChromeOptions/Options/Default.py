class Default:
    def __init__(self) -> None:
        pass


    def run(self,options,user_agent , proxy_str, arguments):
        for arg in  arguments:
            options.add_argument(arg)
        return options