class UserState:
    def __init__(self):
        self.energy = 0.7
        self.stress = 0.5
        self.sleep_debt = 1.0
        self.activity_level = 0.4
        self.nutrition_score = 0.6

    def to_dict(self):
        return {
            "energy": self.energy,
            "stress": self.stress,
            "sleep_debt": self.sleep_debt,
            "activity_level": self.activity_level,
            "nutrition_score": self.nutrition_score,
        }