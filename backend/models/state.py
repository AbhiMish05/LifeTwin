class UserState:
    def __init__(self):
        self.energy = 0.7
        self.stress = 0.5
        self.sleep_debt = 1.0
        self.activity_level = 0.4

        self.time_of_day = "morning"
        self.goal = "productivity"
        self.history = []

    def to_dict(self):
        return {
            "energy": self.energy,
            "stress": self.stress,
            "sleep_debt": self.sleep_debt,
            "activity_level": self.activity_level,
            "time_of_day": self.time_of_day,
            "goal": self.goal,
            "history": self.history
        }