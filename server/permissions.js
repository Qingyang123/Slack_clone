const createResolver = (resolver) => {
    const baseResolver = resolver;

    baseResolver.createResolver = (childResolver) => {
        const newResolver = async (parent, args, context, info) => {
            await resolver(parent, args, context, info);
            return childResolver(parent, args, context, info);
        };
        return createResolver(newResolver);
    };
    return baseResolver;
};

export const requiresAuth = createResolver((parent, args, context) => {
    if (!context.user || !context.user.id) {
        throw new Error('Not authenticated');
    }
});

export const requiresAdmin = requiresAuth.createResolver((parent, args, context) => {
    if (!context.user.isAdmin) {
        throw new Error('Requires admin access');
    }
}); 


export const requiresTeamAccess = createResolver(async (parent, { channelId }, { user, models }) => {
    if (!user || !user.id) {
      throw new Error('Not authenticated');
    }
    // check if part of the team
    const channel = await models.Channel.findOne({ where: { id: channelId } });
    const member = await models.Member.findOne({
        where: { teamId: channel.teamId, userId: user.id },
    });
    if (!member) {
        throw new Error("You have to be a member of the team to subcribe to it's messages");
    }
});

export const directMessageSubscription = createResolver(async (parent, { teamId, otherUserId }, { user, models }) => {
    if (!user || !user.id) {
      throw new Error('Not authenticated');
    }
    // check if part of the team
    
    const you = await models.Member.findOne({
        where: { teamId, userId: user.id },
    });

    const otherUser = await models.Member.findOne({
        where: { teamId, userId: otherUserId }
    })

    if (!you) {
        throw new Error("You have to be a member of the team to subcribe to the direct message");
    }

    if (!otherUser) {
        throw new Error("The other user (receiver) is not a member of the team.")
    }
});


